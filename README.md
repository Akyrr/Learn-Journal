# Learn Journal

A personal daily learning journal — write what you learn each day, read it from anywhere. Reading is public; writing requires a password.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Material 3 theming, and Neon Postgres. Deploys to Vercel.

## Features

- **CRUD entries** — title, date, markdown notes
- **Search** by title/content, **filter by date**
- **Markdown rendering** (GFM: tables, task lists, code blocks, strikethrough)
- **Material 3 theme** — Neutral scheme, light/dark with system + manual toggle
- **Public reads, protected writes** — anyone can view; create/edit/delete require `AUTH_PASSWORD`

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the three values
npm run db:init              # creates the entries table (needs DATABASE_URL)
npm run dev
```

Open http://localhost:3000.

### Environment variables (`.env.local`)

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon (or any Postgres) connection string — use the **pooled** one |
| `AUTH_PASSWORD` | Password required to create/edit/delete entries |
| `AUTH_SECRET` | Random string that signs the login cookie (`openssl rand -hex 32`) |

## Material 3 theme

All colors come from generated role tokens (`src/app/m3-tokens.css`) — never hardcode hex values in components (see `material_theme_guide.md`).

```bash
npm run theme                # regenerate from the SEED in scripts/m3-theme.ts
SEED=#6750A4 npm run theme   # regenerate from any seed color
```

Light/dark: the header button cycles system → light → dark.

## How auth works

- `src/proxy.ts` (Next's middleware) redirects `/new` and `/entry/[id]/edit` to `/login` when no valid session cookie exists, and returns 401 for unauthenticated `POST/PATCH/DELETE` on `/api/entries`.
- `POST /api/login` checks `AUTH_PASSWORD` and sets an HMAC-signed, HTTP-only cookie (`src/lib/auth.ts`), valid for 30 days.
- Reading (pages + `GET` APIs) needs no login.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo (framework auto-detected as Next.js).
3. Add the three env vars above under **Settings → Environment Variables** (same values as `.env.local`; for `DATABASE_URL` use the Neon pooled string).
4. Deploy. The database schema is already created — no build step needed.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run theme` | Regenerate M3 color tokens from seed |
| `npm run db:init` | Create the `entries` table (idempotent) |
