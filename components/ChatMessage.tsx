"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { cn } from "@/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const user = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", user ? "justify-end" : "justify-start")}
    >
      {!user ? (
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-300/20 text-cyan-200">
          <Bot className="h-4 w-4" />
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-2xl rounded-2xl px-4 py-3 text-sm leading-7",
          user ? "bg-cyan-300 text-slate-950" : "glass-panel text-slate-100"
        )}
      >
        {content}
      </div>
      {user ? (
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-slate-100">
          <User className="h-4 w-4" />
        </span>
      ) : null}
    </motion.div>
  );
}
