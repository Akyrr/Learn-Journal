"use client";

import { useRouter } from "next/navigation";
import { ThemeMenu } from "@/components/theme-menu";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="m3-label-large h-10 rounded-full px-4 text-primary transition-colors hover:bg-primary/8 active:bg-primary/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      Log out
    </button>
  );
}

export function HeaderActions({ authed }: { authed: boolean }) {
  return (
    <div className="flex items-center gap-1">
      {authed ? <LogoutButton /> : null}
      <ThemeMenu />
    </div>
  );
}
