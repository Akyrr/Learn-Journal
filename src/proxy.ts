import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/auth";

const MUTATING = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function safeNext(path: string): string {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\") ? path : "/";
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authed = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const isApi = pathname.startsWith("/api/");
  const isMutation = MUTATING.has(request.method);

  if (isApi) {
    // Reads stay public; only mutations need a session.
    if (isMutation && !authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!authed) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", safeNext(pathname + search));
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/new", "/entry/:id/edit", "/api/entries", "/api/entries/:id"],
};
