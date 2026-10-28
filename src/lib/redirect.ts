const FALLBACK = "/";
const BASE = "https://journal.invalid";

/**
 * Resolve a user-supplied `next` value to a same-origin, path-only path.
 * Rejects absolute URLs, protocol-relative (`//`), and backslashes — browsers
 * treat `\` as `/`, so `/\evil.com` would otherwise leave the site.
 */
export function safeNextPath(value: string | null | undefined, fallback = FALLBACK): string {
  if (!value || !value.startsWith("/") || value.includes("\\")) return fallback;
  if (/[\u0000-\u001f]/.test(value)) return fallback;
  try {
    const url = new URL(value, BASE);
    if (url.origin !== BASE) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
