import Link from "next/link";
import { NoteForm } from "@/components/NoteForm";

export default function AddNotePage() {
  return (
    <main className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl text-slate-100">Capture Knowledge</h1>
          <p className="mt-2 text-sm text-slate-300">Add notes, links, or insights. AI will summarize and auto-tag each entry.</p>
        </div>
        <Link href="/dashboard" className="text-sm text-cyan-200 underline-offset-4 hover:underline">
          View dashboard
        </Link>
      </div>

      <NoteForm />
    </main>
  );
}
