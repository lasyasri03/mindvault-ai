import { generateGroundedAnswer, generateSummaryAndTags } from "@/services/aiService";
import { createNote, deleteNoteById, getNoteById, listNotes } from "@/services/knowledgeService";
import type { AskResult, Note, NoteType } from "@/types";
import { toTagArray, tokenize } from "@/utils";

const demoMode = process.env.DEMO_MODE === "true";

function buildKnowledgeBaseAnswer(question: string, notes: Note[]): string {
  const lines: string[] = [];
  lines.push("Answer:");
  lines.push("");
  lines.push("Based on your stored notes, here are the relevant topics:");
  lines.push("");

  notes.forEach((note, index) => {
    const detail = note.summary?.trim() || note.content.slice(0, 240).trim();
    lines.push(`${index + 1}. ${note.title}`);
    lines.push(detail);
    lines.push("");
  });

  const tagPool = notes.flatMap((note) => note.tags || []);
  const topTags = Array.from(new Set(tagPool)).slice(0, 5);
  if (topTags.length > 0) {
    lines.push(`These topics relate to: ${topTags.join(", ")}.`);
    lines.push("");
  }

  lines.push("Answer generated from your knowledge base.");
  return lines.join("\n");
}

export async function createNoteWithAI(input: {
  title: string;
  content: string;
  type: NoteType;
  source_url?: string | null;
  tags?: string | string[] | null;
}): Promise<Note> {
  const userTags = toTagArray(input.tags ?? null);
  let ai = { summary: input.content.slice(0, 240), tags: [] as string[] };

  if (!demoMode) {
    try {
      ai = await generateSummaryAndTags(input.content);
    } catch (error) {
      console.error("[knowledge] Failed to generate summary/tags, using fallback values:", error);
    }
  }

  const mergedTags = Array.from(new Set([...ai.tags, ...userTags])).slice(0, 10);

  return createNote({
    title: input.title.trim(),
    content: input.content.trim(),
    type: input.type,
    source_url: input.source_url?.trim() || null,
    tags: mergedTags,
    summary: ai.summary
  });
}

export async function searchNotesByQuestion(question: string): Promise<Note[]> {
  const words = tokenize(question);
  const recentNotes = await listNotes({ sort: "desc" });
  if (recentNotes.length === 0) return [];

  const scored = recentNotes
    .map((note) => {
      const haystack = `${note.title} ${note.summary || ""} ${note.content} ${(note.tags || []).join(" ")}`.toLowerCase();
      const score = words.reduce((total, word) => total + (haystack.includes(word) ? 1 : 0), 0);
      return { note, score };
    })
    .sort((a, b) => b.score - a.score || Date.parse(b.note.created_at) - Date.parse(a.note.created_at));

  const top = scored.filter((item) => item.score > 0).slice(0, 6).map((item) => item.note);
  if (top.length > 0) return top;
  return recentNotes.slice(0, 5);
}

export async function askKnowledgeBase(question: string): Promise<AskResult> {
  const notes = await searchNotesByQuestion(question);

  if (notes.length === 0) {
    return {
      answer: "No matching notes found in your knowledge base yet.\n\nAnswer generated from your knowledge base.",
      sources: []
    };
  }

  if (demoMode) {
    const sources = notes.map((note) => ({
      id: note.id,
      title: note.title,
      summary: note.summary || "",
      created_at: note.created_at
    }));

    const answer = buildKnowledgeBaseAnswer(question, notes);

    return { answer, sources };
  }

  let answer = "";
  try {
    answer = await generateGroundedAnswer(question, notes);
    if (!answer || !answer.trim()) {
      answer = buildKnowledgeBaseAnswer(question, notes);
    }
  } catch (error) {
    console.error("[knowledge] Failed to generate Gemini grounded answer:", error);
    answer = buildKnowledgeBaseAnswer(question, notes);
  }
  const sources = notes.map((note) => ({
    id: note.id,
    title: note.title,
    summary: note.summary || "",
    created_at: note.created_at
  }));

  return { answer, sources };
}

export { deleteNoteById, getNoteById, listNotes };
