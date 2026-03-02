"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Bot, LayoutDashboard, Notebook, Settings, Sparkles } from "lucide-react";
import { cn } from "@/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-note", label: "Capture", icon: Notebook },
  { href: "/ask", label: "Ask AI", icon: Bot },
  { href: "/docs", label: "Docs", icon: Settings }
] satisfies Array<{ href: Route; label: string; icon: React.ComponentType<{ className?: string }> }>;

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="glass-panel hidden h-fit w-60 rounded-2xl p-4 lg:block">
      <p className="mb-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-1 text-xs font-medium text-cyan-100">
        <Sparkles className="h-3.5 w-3.5" />
        Knowledge Workspace
      </p>

      <nav aria-label="Workspace navigation" className="space-y-1.5">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition",
                active ? "bg-white/20 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
