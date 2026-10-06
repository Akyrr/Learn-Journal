"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

function Icon({ mode }: { mode: "light" | "dark" | "system" }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5h1v3.09A7 7 0 0 1 17.91 10H21v1h-3.09A7 7 0 0 1 13 17.91V21h-1v-3.09A7 7 0 0 1 4.09 13H1v-1h3.09A7 7 0 0 1 11 4.09V1h1Z" />
      </svg>
    );
  }
  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12.1 2a9 9 0 1 0 9.9 12.1A7.5 7.5 0 0 1 12.1 2Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
      <path d="M3 5h18v2H3V5Zm3 6h12v2H6v-2Zm3 6h6v2H9v-2Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Distinguishes server render (no theme known) from the client to avoid hydration mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <span className="inline-block h-10 w-10" />;
  }

  const current = (theme ?? "system") as "light" | "dark" | "system";
  const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";

  return (
    <button
      aria-label={`Theme: ${current}. Switch to ${next}`}
      title={`Theme: ${current}`}
      onClick={() => setTheme(next)}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      <Icon mode={current} />
    </button>
  );
}
