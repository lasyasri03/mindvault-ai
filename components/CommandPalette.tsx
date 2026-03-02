"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";

const items = [
  { href: "/", label: "Home" },
  { href: "/add-note", label: "Add Note" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ask", label: "Ask AI" },
  { href: "/docs", label: "Docs" }
] satisfies Array<{ href: Route; label: string }>;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handler(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 p-4 pt-20"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div className="glass-panel w-full max-w-md rounded-2xl p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="px-2 pb-2 text-xs uppercase tracking-wider text-slate-400">Command Palette</p>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="glass-input mb-2 w-full"
          placeholder="Type a route..."
          aria-label="Search commands"
        />
        <div className="space-y-1" role="listbox" aria-label="Command results">
          {filtered.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
              className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              {item.label}
            </Link>
          ))}
          {filtered.length === 0 ? <p className="px-3 py-2 text-sm text-slate-400">No matching commands</p> : null}
        </div>
      </div>
    </div>
  );
}
