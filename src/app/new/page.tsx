import { EntryForm } from "@/components/entry-form";

export default function NewEntryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="m3-headline-small text-on-surface">New entry</h1>
      <EntryForm />
    </div>
  );
}
