import Link from "next/link";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";
import { HeaderActions } from "@/components/header-actions";

export async function SiteHeader() {
  const store = await cookies();
  const authed = Boolean(store.get(SESSION_COOKIE)?.value);

  return (
    <header className="sticky top-0 z-10 border-b border-outline-variant bg-surface-container/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="m3-title-large text-on-surface transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-s"
        >
          Learn Journal
        </Link>
        <HeaderActions authed={authed} />
      </div>
    </header>
  );
}
