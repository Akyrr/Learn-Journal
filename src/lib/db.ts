import { neon } from "@neondatabase/serverless";

export type Entry = {
  id: string;
  title: string;
  content: string;
  entry_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
};

function client(): {
  query: (text: string, params?: unknown[]) => Promise<unknown[]>;
} {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set — add your Neon connection string");
  return neon(url) as unknown as ReturnType<typeof client>;
}

async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const rows = await client().query(text, params);
  return rows as T[];
}

export async function listEntries(opts: { q?: string; date?: string } = {}): Promise<Entry[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.q) {
    params.push(`%${opts.q}%`);
    where.push(`(title ILIKE $${params.length} OR content ILIKE $${params.length})`);
  }
  if (opts.date) {
    params.push(opts.date);
    where.push(`entry_date = $${params.length}`);
  }
  const sql = `
    SELECT id, title, content, entry_date::text AS entry_date, created_at, updated_at
    FROM entries
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY entry_date DESC, created_at DESC
    LIMIT 200`;
  return query<Entry>(sql, params);
}

export async function getEntry(id: string): Promise<Entry | null> {
  const rows = await query<Entry>(
    "SELECT id, title, content, entry_date::text AS entry_date, created_at, updated_at FROM entries WHERE id = $1",
    [id],
  );
  return rows[0] ?? null;
}

export async function createEntry(data: {
  title: string;
  content: string;
  entry_date: string;
}): Promise<Entry> {
  const rows = await query<Entry>(
    `INSERT INTO entries (title, content, entry_date)
     VALUES ($1, $2, $3)
     RETURNING id, title, content, entry_date::text AS entry_date, created_at, updated_at`,
    [data.title, data.content, data.entry_date],
  );
  return rows[0];
}

export async function updateEntry(
  id: string,
  data: { title?: string; content?: string; entry_date?: string },
): Promise<Entry | null> {
  const rows = await query<Entry>(
    `UPDATE entries
     SET title = COALESCE($2, title),
         content = COALESCE($3, content),
         entry_date = COALESCE($4, entry_date),
         updated_at = now()
     WHERE id = $1
     RETURNING id, title, content, entry_date::text AS entry_date, created_at, updated_at`,
    [id, data.title ?? null, data.content ?? null, data.entry_date ?? null],
  );
  return rows[0] ?? null;
}

export async function deleteEntry(id: string): Promise<boolean> {
  const rows = await query<{ id: string }>("DELETE FROM entries WHERE id = $1 RETURNING id", [id]);
  return rows.length > 0;
}
