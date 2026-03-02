"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Brain, BookOpen, MessageSquare, Sparkles } from "lucide-react";

const features = [
  {
    title: "Capture Fast",
    description: "Capture thoughts, links, and insights in seconds with AI-enhanced metadata.",
    icon: BookOpen
  },
  {
    title: "Organize Smartly",
    description: "AI summaries and auto tags keep your knowledge base searchable and clean.",
    icon: Sparkles
  },
  {
    title: "Ask Naturally",
    description: "Ask questions in plain language and get grounded answers with note sources.",
    icon: MessageSquare
  }
];

export default function HomePage() {
  return (
    <main className="space-y-10">
      <motion.header
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="card-surface grain overflow-hidden p-8 md:p-12"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-cyan-300/20 px-3 py-1 text-xs font-medium text-cyan-100">
          <Brain className="h-4 w-4" /> Second Brain AI Platform
        </div>
        <h1 className="max-w-3xl text-4xl leading-tight text-slate-100 md:text-6xl">Turn your notes into an AI-powered decision engine.</h1>
        <p className="mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
          A full-stack knowledge operating system with AI summaries, auto tagging, semantic retrieval, and conversational querying.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/add-note" className="rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:brightness-95">
            Add a Note
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/15"
          >
            Open Dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/ask" className="rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white hover:bg-white/15">
            Ask Your Brain
          </Link>
        </div>
      </motion.header>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ y: -4 }}
            className="card-surface p-5"
          >
            <feature.icon className="mb-3 h-5 w-5 text-cyan-200" />
            <h2 className="mb-2 text-2xl text-slate-100">{feature.title}</h2>
            <p className="text-sm leading-6 text-slate-300">{feature.description}</p>
          </motion.article>
        ))}
      </section>
    </main>
  );
}
