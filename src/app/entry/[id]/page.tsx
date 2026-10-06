import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getEntry } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { DeleteButton } from "@/components/delete-button";

export default async function EntryPage({ params }: PageProps<"/entry/[id]">) {
  const { id } = await params;
  let entry;
  try {
    entry = await getEntry(id);
  } catch {
    notFound();
  }
  if (!entry) notFound();

  return (
    <article className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="m3-label-large inline-flex h-10 items-center gap-1 rounded-full px-3 text-primary transition-colors hover:bg-primary/8"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2Z" />
          </svg>
          All entries
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/entry/${entry.id}/edit`}>
            <span className="m3-label-large inline-flex h-10 items-center rounded-full border border-outline px-5 text-primary transition-colors hover:bg-primary/8">
              Edit
            </span>
          </Link>
          <DeleteButton id={entry.id} title={entry.title} />
        </div>
      </div>

      <header className="flex flex-col gap-2">
        <time
          dateTime={entry.entry_date}
          className="m3-label-medium w-fit rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container"
        >
          {formatDate(entry.entry_date)}
        </time>
        <h1 className="m3-headline-small text-on-surface">{entry.title}</h1>
      </header>

      <div className="rounded-m bg-surface-container p-6">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
