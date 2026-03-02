"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { NoteCard } from "@/components/NoteCard";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Toast } from "@/components/Toast";
import type { Note, NoteType } from "@/lib/types";

const typeOptions: Array<NoteType | "all"> = ["all", "note", "link", "insight"];

function isAbortLikeError(err: unknown): boolean {
  if (!err) return false;
  const message = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : "";
  return name === "AbortError" || message.toLowerCase().includes("signal is aborted");
}

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<NoteType | "all">("all");
  const [tags, setTags] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const tagList = useMemo(() => tags.split(",").map((tag) => tag.trim().toLowerCase()).filter(Boolean), [tags]);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (type && type !== "all") params.set("type", type);
      if (tagList.length > 0) params.set("tags", tagList.join(","));
      params.set("sort", sort);

      const response = await fetch(`/api/notes?${params.toString()}`, { signal: controller.signal, cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load notes.");
      if (controller.signal.aborted) return;
      setNotes(data.notes || []);
      setLoading(false);
    }

    load().catch((err) => {
      if (isAbortLikeError(err) || controller.signal.aborted) {
        return;
      }
      setError(err instanceof Error ? err.message : "Unable to load dashboard.");
      setLoading(false);
    });
    return () => controller.abort();
  }, [search, type, tagList, sort]);

  async function handleDeleteNote(id: string) {
    try {
      setError(null);
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Failed to delete note.");

      setNotes((current) => current.filter((note) => note.id !== id));
      setToast("Note deleted.");
      setTimeout(() => setToast(null), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete note.");
    }
  }

  return (
    <main className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl text-slate-100">Knowledge Dashboard</h1>
          <p className="mt-2 text-sm text-slate-300">Search, filter, and explore your second brain.</p>
        </div>
      </header>

      {error ? <ErrorBanner message={error} /> : null}

      <section className="card-surface space-y-4 p-4">
        <SearchBar value={search} onChange={setSearch} />
        <div className="grid gap-3 md:grid-cols-3">
          <select
            aria-label="Filter by note type"
            value={type}
            onChange={(event) => setType(event.target.value as NoteType | "all")}
            className="glass-input"
          >
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <input
            aria-label="Filter by tags"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            className="glass-input"
            placeholder="Filter tags: react,ai"
          />
          <select
            aria-label="Sort notes by date"
            value={sort}
            onChange={(event) => setSort(event.target.value as "asc" | "desc")}
            className="glass-input"
          >
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </section>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : notes.length === 0 ? (
        <p className="card-surface p-6 text-sm text-slate-300">No notes found for current filters.</p>
      ) : (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
        >
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onDelete={handleDeleteNote} />
          ))}
        </motion.section>
      )}

      <Toast message={toast} />
    </main>
  );
}
