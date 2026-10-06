/**
 * Creates the entries table in your Neon database.
 * Run once:  npm run db:init
 * Requires DATABASE_URL in the environment (or in .env.local).
 */
import { neon } from "@neondatabase/serverless";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
    break;
  } catch {
    /* file not found — keep going */
  }
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local first.");
  process.exit(1);
}

const sql = neon(url);

const statements = [
  `CREATE TABLE IF NOT EXISTS entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    entry_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS idx_entries_date ON entries (entry_date DESC)`,
];

async function main() {
  for (const statement of statements) {
    await sql.query(statement);
  }
  console.log("Schema ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
