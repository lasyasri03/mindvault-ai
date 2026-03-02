"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Note } from "@/types";

interface NoteCardProps {
  note: Note;
  onDelete?: (id: string) => void | Promise<void>;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  const handleDelete = async () => {
    const confirmed = window.confirm(`Delete "${note.title}"? This action cannot be undone.`);
    if (!confirmed || !onDelete) return;
    await onDelete(note.id);
  };

  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="card-surface grain overflow-hidden p-5"
    >
      <div className="mb-3 flex items-center justify-between text-xs uppercase tracking-wide text-slate-400">
        <span className="rounded-full bg-cyan-200/20 px-2 py-1 text-cyan-100">{note.type}</span>
        <span>{new Date(note.created_at).toLocaleDateString()}</span>
      </div>
      <h3 className="mb-2 text-xl font-semibold text-slate-100">{note.title}</h3>
      <p className="mb-4 text-sm leading-6 text-slate-300">{note.summary || note.content.slice(0, 140)}</p>
      {note.tags.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {note.tags.slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-2 py-1 text-xs text-cyan-100">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="flex items-center justify-between gap-3">
        <Link href={`/dashboard/${note.id}`} className="text-sm font-medium text-cyan-200 underline-offset-4 hover:underline">
          View details
        </Link>
        {onDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
          >
            Delete
          </button>
        ) : null}
      </div>
    </motion.article>
  );
}
