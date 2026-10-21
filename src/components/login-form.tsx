"use client";

import { useState } from "react";
import { Button, TextField } from "@/components/ui";

export function LoginForm({ next }: { next: string }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Login failed");
        return;
      }
      // Hard navigation on purpose: router.push + router.refresh race and can leave
      // a blank page (the login route's redirect isn't applied when it was reached
      // via client-side navigation). A full load guarantees fresh session + layout.
      window.location.replace(next);
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <TextField
        label="Password"
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Write password"
        required
        autoFocus
      />
      {error ? (
        <p role="alert" className="m3-body-medium rounded-s bg-error-container px-4 py-3 text-on-error-container">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={submitting}>
        {submitting ? "Checking…" : "Unlock"}
      </Button>
    </form>
  );
}
