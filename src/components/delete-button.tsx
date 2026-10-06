"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export function DeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function remove() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/entries/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error ?? `Delete failed (${res.status})`);
        setDeleting(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      window.alert("Network error");
      setDeleting(false);
    }
  }

  return (
    <Button variant="error" onClick={remove} disabled={deleting}>
      {deleting ? "Deleting…" : "Delete"}
    </Button>
  );
}
