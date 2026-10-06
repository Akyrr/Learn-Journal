"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, TextArea, TextField } from "@/components/ui";
import type { Entry } from "@/lib/db";

function today(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function EntryForm({ entry }: { entry?: Entry }) {
  const router = useRouter();
  const [title, setTitle] = useState(entry?.title ?? "");
  const [date, setDate] = useState(entry?.entry_date ?? today());
  const [content, setContent] = useState(entry?.content ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(entry ? `/api/entries/${entry.id}` : "/api/entries", {
        method: entry ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, entry_date: date }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? `Something went wrong (${res.status})`);
        return;
      }
      const id = entry ? entry.id : data.entry?.id;
      router.push(`/entry/${id}`);
      router.refresh();
    } catch {
      setError("Network error — are you online?");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <TextField
        label="Title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What did you learn?"
        required
        autoFocus
      />
      <TextField
        label="Date"
        name="entry_date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        className="max-w-52"
      />
      <TextArea
        label="Notes (Markdown is supported)"
        name="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="# What I learned&#10;&#10;Write it in your own words..."
        rows={16}
        className="font-mono"
      />
      {error ? (
        <p role="alert" className="m3-body-medium rounded-s bg-error-container px-4 py-3 text-on-error-container">
          {error}
        </p>
      ) : null}
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : entry ? "Save changes" : "Create entry"}
        </Button>
        <Button
          type="button"
          variant="text"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
