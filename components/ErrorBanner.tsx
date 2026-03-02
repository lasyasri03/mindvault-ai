"use client";

import { AlertTriangle } from "lucide-react";

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
      <p className="inline-flex items-center gap-2 font-medium">
        <AlertTriangle className="h-4 w-4" />
        {message}
      </p>
    </div>
  );
}

