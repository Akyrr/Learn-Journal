import { notFound } from "next/navigation";
import { getEntry } from "@/lib/db";
import { EntryForm } from "@/components/entry-form";

export default async function EditEntryPage({ params }: PageProps<"/entry/[id]/edit">) {
  const { id } = await params;
  let entry;
  try {
    entry = await getEntry(id);
  } catch {
    notFound();
  }
  if (!entry) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m3-headline-small text-on-surface">Edit entry</h1>
      <EntryForm entry={entry} />
    </div>
  );
}
