import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "lj_session";
const SESSION_DAYS = 30;

function secret(): string {
  const s = process.env.AUTH_SECRET ?? process.env.AUTH_PASSWORD;
  if (!s) throw new Error("Set AUTH_SECRET (or AUTH_PASSWORD) in the environment");
  return s;
}

function hmac(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.AUTH_PASSWORD;
  if (!expected) throw new Error("Set AUTH_PASSWORD in the environment");
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function createSessionToken(): string {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${expires}.${hmac(`v1:${expires}`)}`;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const [expRaw, sig, ...rest] = token.split(".");
  if (!sig || rest.length > 0) return false;
  const expires = Number(expRaw);
  if (!Number.isFinite(expires) || expires <= Date.now()) return false;
  const expected = hmac(`v1:${expires}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function hasWriteSession(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionToken(store.get(SESSION_COOKIE)?.value);
}
