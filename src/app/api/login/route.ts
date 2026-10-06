import { NextResponse, type NextRequest } from "next/server";
import { createSessionToken, SESSION_COOKIE, verifyPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let password: unknown;
  try {
    ({ password } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (typeof password !== "string") {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  try {
    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Server is missing AUTH_PASSWORD" }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  return response;
}
