import { NextResponse, type NextRequest } from "next/server";
import { createEntry, listEntries } from "@/lib/db";
import { hasWriteSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() || undefined;
  const date = searchParams.get("date")?.trim() || undefined;
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }
  try {
    const entries = await listEntries({ q, date });
    return NextResponse.json({ entries });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await hasWriteSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { title, content, entry_date } = (body ?? {}) as Record<string, unknown>;
  if (typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (typeof content !== "string") {
    return NextResponse.json({ error: "Content must be a string" }, { status: 400 });
  }
  if (typeof entry_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(entry_date)) {
    return NextResponse.json({ error: "entry_date must be YYYY-MM-DD" }, { status: 400 });
  }

  try {
    const entry = await createEntry({
      title: title.trim().slice(0, 300),
      content,
      entry_date,
    });
    return NextResponse.json({ entry }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
