"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};
const OPTIONS = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
] as const;

type Mode = (typeof OPTIONS)[number]["value"];

function Icon({ mode }: { mode: Mode }) {
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
      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-6v2h3v2H8v-2h3v-2H5a2 2 0 0 1-2-2V5Zm2 0v10h14V5H5Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="m9.55 17.3-4.6-4.6 1.4-1.4 3.2 3.2 7.1-7.1 1.4 1.4-8.5 8.5Z" />
    </svg>
  );
}

export function ThemeMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // Distinguishes server render (no theme known) from the client to avoid hydration mismatch.
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const current = (theme ?? "system") as Mode;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const selected = OPTIONS.findIndex((option) => option.value === current);
    itemRefs.current[selected]?.focus();
  }, [open, current]);

  if (!mounted) {
    return <span className="inline-block h-10 w-10" />;
  }

  function close() {
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onMenuKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const index = itemRefs.current.findIndex((item) => item === document.activeElement);
    const last = OPTIONS.length - 1;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      itemRefs.current[index === last ? 0 : index + 1]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      itemRefs.current[index <= 0 ? last : index - 1]?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      itemRefs.current[0]?.focus();
    } else if (event.key === "End") {
      event.preventDefault();
      itemRefs.current[last]?.focus();
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Theme: ${current}`}
        title={`Theme: ${current}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-on-surface/8 active:bg-on-surface/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      >
        <Icon mode={current} />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Theme"
          onKeyDown={onMenuKeyDown}
          className="absolute top-full right-0 z-20 mt-2 min-w-44 rounded-s bg-surface-container-high p-1 elevation-2"
        >
          {OPTIONS.map((option, index) => {
            const selected = option.value === current;
            return (
              <button
                key={option.value}
                ref={(element) => {
                  itemRefs.current[index] = element;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                tabIndex={-1}
                onClick={() => {
                  setTheme(option.value);
                  close();
                }}
                className={`m3-label-large flex w-full items-center gap-3 rounded-xs px-3 py-2.5 text-left transition-colors hover:bg-on-surface/8 focus-visible:bg-on-surface/12 focus-visible:outline-none ${
                  selected ? "text-primary" : "text-on-surface"
                }`}
              >
                <Icon mode={option.value} />
                <span className="flex-1">{option.label}</span>
                {selected ? <CheckIcon /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
