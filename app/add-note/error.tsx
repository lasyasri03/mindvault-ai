"use client";

export default function AddNoteError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 p-6">
      <h2 className="text-xl font-semibold text-rose-100">Add Note page failed</h2>
      <p className="mt-2 text-sm text-rose-200">{error.message || "Unexpected route error."}</p>
      <button onClick={() => reset()} className="mt-4 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900">
        Retry
      </button>
    </div>
  );
}

