"use client";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-rose-400/40 bg-rose-500/10 p-10 text-center">
      <h2 className="text-2xl font-bold text-rose-100">Something went wrong</h2>
      <p className="mt-3 text-sm text-rose-200/90">{error.message || "An unexpected error occurred."}</p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-900"
      >
        Try again
      </button>
    </div>
  );
}

