"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { ChatMessage } from "@/components/ChatMessage";
import { ErrorBanner } from "@/components/ErrorBanner";

interface AskResponse {
  answer: string;
  sources: Array<{ id: string; title: string; summary: string; created_at: string }>;
}

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AskResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [askedQuestion, setAskedQuestion] = useState("");

  async function ask() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
        cache: "no-store"
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to answer question.");
      setData(payload);
      setAskedQuestion(question.trim());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message.includes("fetch failed") ? "Network request failed. Verify the backend is running and try again." : message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-4xl text-slate-100">Ask Your Knowledge Base</h1>
        <p className="mt-2 text-sm text-slate-300">Ask natural language questions and get answers grounded in your notes.</p>
      </header>

      <section className="card-surface space-y-3 p-5">
        <textarea
          aria-label="Ask a question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder='Example: "What notes do I have about React performance?"'
          className="glass-input min-h-28 w-full"
        />
        <button
          aria-label="Submit question"
          onClick={ask}
          disabled={loading}
          className="inline-flex items-center rounded-2xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-900 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            "Ask AI"
          )}
        </button>
      </section>

      {error ? <ErrorBanner message={error} /> : null}

      {data ? (
        <section className="space-y-4">
          <div className="space-y-3">
            {askedQuestion ? <ChatMessage role="user" content={askedQuestion} /> : null}
            <ChatMessage role="assistant" content={data.answer} />
          </div>

          <motion.article initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-5">
            <h2 className="mb-3 text-2xl text-slate-100">Sources Used</h2>
            <div className="space-y-2">
              {data.sources.map((source) => (
                <div key={source.id} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className="font-medium text-slate-100">{source.title}</p>
                  <p className="text-xs text-slate-400">{new Date(source.created_at).toLocaleString()}</p>
                  <p className="mt-1 text-sm text-slate-300">{source.summary}</p>
                </div>
              ))}
            </div>
          </motion.article>
        </section>
      ) : null}
    </main>
  );
}
