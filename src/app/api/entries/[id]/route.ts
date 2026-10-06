import { NextResponse, type NextRequest } from "next/server";
import { deleteEntry, getEntry, updateEntry } from "@/lib/db";
import { hasWriteSession } from "@/lib/auth";

export async function GET(_request: NextRequest, ctx: RouteContext<"/api/entries/[id]">) {
  const { id } = await ctx.params;
  try {
    const entry = await getEntry(id);
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ entry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, ctx: RouteContext<"/api/entries/[id]">) {
  if (!(await hasWriteSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, content, entry_date } = (body ?? {}) as Record<string, unknown>;
  const patch: { title?: string; content?: string; entry_date?: string } = {};

  if (title !== undefined) {
    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
    }
    patch.title = title.trim().slice(0, 300);
  }
  if (content !== undefined) {
    if (typeof content !== "string") {
      return NextResponse.json({ error: "Content must be a string" }, { status: 400 });
    }
    patch.content = content;
  }
  if (entry_date !== undefined) {
    if (typeof entry_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
      return NextResponse.json({ error: "entry_date must be YYYY-MM-DD" }, { status: 400 });
    }
    patch.entry_date = entry_date;
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  try {
    const entry = await updateEntry(id, patch);
    if (!entry) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ entry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<"/api/entries/[id]">) {
  if (!(await hasWriteSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  try {
    const deleted = await deleteEntry(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
