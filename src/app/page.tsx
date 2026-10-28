import Link from "next/link";
import { listEntries, type Entry } from "@/lib/db";
import { excerpt, formatDate } from "@/lib/format";
import { Card } from "@/components/ui";

function SetupNotice({ message }: { message: string }) {
  return (
    <div className="rounded-m bg-error-container p-5 text-on-error-container">
      <p className="m3-title-medium">Database not ready</p>
      <p className="m3-body-medium mt-1">{message}</p>
    </div>
  );
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <div className="rounded-m border border-dashed border-outline-variant p-10 text-center">
      <p className="m3-title-medium text-on-surface">
        {filtered ? "No matching entries" : "No entries yet"}
      </p>
      <p className="m3-body-medium mt-1 text-on-surface-variant">
        {filtered
          ? "Try a different search or clear the filters."
          : "Press the + button to write what you learned today."}
      </p>
    </div>
  );
}

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const date = typeof params.date === "string" ? params.date.trim() : "";

  let entries: Entry[] = [];
  let dbError: string | null = null;
  try {
    entries = await listEntries({ q: q || undefined, date: date || undefined });
  } catch (err) {
    console.error(err);
    dbError = "Could not reach the database right now. Please try again in a moment.";
  }

  return (
    <div className="flex flex-col gap-6">
      <form method="get" action="/" className="flex flex-wrap items-end gap-3">
        <label className="min-w-52 flex-1">
          <span className="m3-label-medium mb-1.5 block text-on-surface-variant">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search notes…"
            className="m3-body-large w-full rounded-s border border-outline bg-surface px-4 py-2.5 text-on-surface outline-none transition-shadow placeholder:text-on-surface-variant/70 focus:ring-2 focus:ring-primary/50"
          />
        </label>
        <label>
          <span className="m3-label-medium mb-1.5 block text-on-surface-variant">Date</span>
          <input
            type="date"
            name="date"
            defaultValue={date}
            className="m3-body-large rounded-s border border-outline bg-surface px-4 py-2.5 text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary/50"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="m3-label-large h-10 rounded-full bg-secondary-container px-5 text-on-secondary-container transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Filter
          </button>
          {(q || date) && (
            <Link
              href="/"
              className="m3-label-large inline-flex h-10 items-center rounded-full px-4 text-primary transition-colors hover:bg-primary/8"
            >
              Clear
            </Link>
          )}
        </div>
      </form>

      {dbError ? (
        <SetupNotice message={dbError} />
      ) : entries.length === 0 ? (
        <EmptyState filtered={Boolean(q || date)} />
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Link href={`/entry/${entry.id}`} className="block focus-visible:outline-none">
                <Card className="transition-shadow hover:elevation-1 focus-visible:ring-2 focus-visible:ring-primary/50">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="m3-title-medium truncate text-on-surface">{entry.title}</h2>
                    <time
                      dateTime={entry.entry_date}
                      className="m3-label-medium shrink-0 rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container"
                    >
                      {formatDate(entry.entry_date)}
                    </time>
                  </div>
                  <p className="m3-body-medium mt-2 line-clamp-2 text-on-surface-variant">
                    {excerpt(entry.content) || "No notes"}
                  </p>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Link
        href="/new"
        aria-label="New entry"
        className="fixed right-6 bottom-6 z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container elevation-2 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2Z" />
        </svg>
      </Link>
    </div>
  );
}
