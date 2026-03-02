"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { BrainCircuit, Plus, Sparkles } from "lucide-react";
import { cn } from "@/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/add-note", label: "Add Note" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ask", label: "Ask AI" },
  { href: "/docs", label: "Docs" }
] satisfies Array<{ href: Route; label: string }>;

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-4 z-40 mb-6">
      <div className="glass-panel mx-auto flex h-14 w-full items-center justify-between rounded-2xl px-3 md:px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/25">
            <BrainCircuit className="h-4 w-4 text-cyan-200" />
          </span>
          <span className="hidden sm:inline">Second Brain AI</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium transition",
                pathname === link.href ? "bg-white/20 text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="inline-flex items-center gap-2">
          <Link href="/add-note" className="hidden rounded-xl bg-cyan-300 px-3 py-1.5 text-xs font-semibold text-slate-900 md:inline-flex">
            <Plus className="mr-1 h-3.5 w-3.5" />
            New Note
          </Link>
          <span className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2 py-1 text-[11px] text-slate-200">
            <Sparkles className="h-3.5 w-3.5" /> Cmd/Ctrl+K
          </span>
        </div>
      </div>
    </header>
  );
}
