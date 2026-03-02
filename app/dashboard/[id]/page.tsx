import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoteById } from "@/lib/knowledge";

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const note = await getNoteById(params.id);
  if (!note) notFound();

  return (
    <main className="space-y-6">
      <Link href="/dashboard" className="text-sm text-cyan-200 underline-offset-4 hover:underline">
        Back to dashboard
      </Link>

      <article className="card-surface space-y-4 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
          <span className="rounded-full bg-cyan-200/20 px-2 py-1 text-cyan-100">{note.type}</span>
          <span>{new Date(note.created_at).toLocaleString()}</span>
        </div>
        <h1 className="text-4xl text-slate-100">{note.title}</h1>
        {note.summary ? (
          <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-sm text-cyan-100">
            <strong>AI Summary:</strong> {note.summary}
          </div>
        ) : null}
        <p className="whitespace-pre-wrap leading-7 text-slate-200">{note.content}</p>
        {note.source_url ? (
          <a href={note.source_url} target="_blank" rel="noreferrer" className="inline-block text-sm text-cyan-200 underline-offset-4 hover:underline">
            Open source link
          </a>
        ) : null}
        {note.tags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-cyan-100">
                #{tag}
              </span>
            ))}
          </div>
        ) : null}
      </article>
    </main>
  );
}
