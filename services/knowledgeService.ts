import type { Note, NoteType } from "@/types";
import { getSupabaseClient } from "@/lib/supabaseClient";

const demoMode = process.env.DEMO_MODE === "true";

declare global {
  var __secondBrainDemoNotes: Note[] | undefined;
}

function mapDatabaseError(error: any): Error {
  const details = String(error?.details || "");
  const message = String(error?.message || "");
  const code = String(error?.code || "");

  if (details.includes("ENOTFOUND")) {
    return new Error("Cannot reach Supabase host. Check NEXT_PUBLIC_SUPABASE_URL value and DNS/network access.");
  }

  if (message.includes("JWT") || code === "401" || message.includes("Invalid API key")) {
    return new Error("Supabase authentication failed. Check NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  if (message.includes("relation") && message.includes("does not exist")) {
    return new Error("Supabase table 'notes' was not found. Run supabase/schema.sql.");
  }

  return new Error(`Database error: ${message || "Unknown database failure"}`);
}

function getDemoNotesStore(): Note[] {
  if (!globalThis.__secondBrainDemoNotes) {
    globalThis.__secondBrainDemoNotes = [
      {
        id: crypto.randomUUID(),
        title: "React Rendering Basics",
        content: "React updates UI by diffing virtual DOM trees and batching updates.",
        summary: "React batches updates and uses virtual DOM diffing to keep UI updates efficient.",
        type: "note",
        tags: ["react", "frontend", "performance"],
        source_url: null,
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      },
      {
        id: crypto.randomUUID(),
        title: "Frontend Architecture Insight",
        content: "A scalable frontend uses component boundaries, typed APIs, and predictable state transitions.",
        summary: "Scalable frontend architecture depends on clear boundaries, typed contracts, and predictable state.",
        type: "insight",
        tags: ["frontend", "architecture"],
        source_url: null,
        created_at: new Date().toISOString()
      }
    ];
  }

  return globalThis.__secondBrainDemoNotes;
}

function createDemoNote(note: CreateNoteInput): Note {
  const created: Note = {
    id: crypto.randomUUID(),
    title: note.title,
    content: note.content,
    summary: note.summary ?? null,
    type: note.type,
    tags: note.tags ?? [],
    source_url: note.source_url ?? null,
    created_at: new Date().toISOString()
  };

  const store = getDemoNotesStore();
  store.unshift(created);
  return created;
}

function listDemoNotes(filters: {
  search?: string;
  type?: NoteType | "all";
  tags?: string[];
  sort?: "asc" | "desc";
}): Note[] {
  const search = filters.search?.trim().toLowerCase();
  const tags = filters.tags ?? [];
  let notes = [...getDemoNotesStore()];

  if (search) {
    notes = notes.filter((note) => {
      const text = `${note.title} ${note.content} ${note.summary ?? ""}`.toLowerCase();
      return text.includes(search);
    });
  }

  if (filters.type && filters.type !== "all") {
    notes = notes.filter((note) => note.type === filters.type);
  }

  if (tags.length > 0) {
    notes = notes.filter((note) => tags.every((tag) => note.tags.includes(tag)));
  }

  notes.sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
  if (filters.sort !== "asc") {
    notes.reverse();
  }

  return notes;
}

function normalizeNote(row: any): Note {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    summary: row.summary ?? null,
    type: row.type,
    tags: Array.isArray(row.tags) ? row.tags : [],
    source_url: row.source_url ?? null,
    created_at: row.created_at
  };
}

export interface CreateNoteInput {
  title: string;
  content: string;
  type: NoteType;
  source_url?: string | null;
  tags?: string[];
  summary?: string | null;
}

export async function createNote(note: CreateNoteInput): Promise<Note> {
  if (demoMode) {
    return createDemoNote(note);
  }

  const supabase = getSupabaseClient();
  const payload = {
    title: note.title,
    content: note.content,
    type: note.type,
    source_url: note.source_url ?? null,
    tags: note.tags ?? [],
    summary: note.summary ?? null
  };

  const { data, error } = await supabase.from("notes").insert(payload).select("*").single();

  if (error) {
    console.error("[db] createNote failed:", error);
    const mapped = mapDatabaseError(error);
    if (demoMode && mapped.message.includes("Cannot reach Supabase host")) {
      console.warn("[db] Falling back to demo note store for createNote.");
      return createDemoNote(note);
    }
    throw mapped;
  }
  return normalizeNote(data);
}

export async function listNotes(filters: {
  search?: string;
  type?: NoteType | "all";
  tags?: string[];
  sort?: "asc" | "desc";
}): Promise<Note[]> {
  if (demoMode) {
    return listDemoNotes(filters);
  }

  const supabase = getSupabaseClient();
  let query = supabase.from("notes").select("*");

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.or(`title.ilike.${term},content.ilike.${term},summary.ilike.${term}`);
  }

  if (filters.type && filters.type !== "all") {
    query = query.eq("type", filters.type);
  }

  if (filters.tags && filters.tags.length > 0) {
    for (const tag of filters.tags) {
      query = query.contains("tags", [tag]);
    }
  }

  query = query.order("created_at", { ascending: filters.sort === "asc" });

  const { data, error } = await query;
  if (error) {
    console.error("[db] listNotes failed:", error);
    const mapped = mapDatabaseError(error);
    if (demoMode && mapped.message.includes("Cannot reach Supabase host")) {
      console.warn("[db] Falling back to demo note store for listNotes.");
      return listDemoNotes(filters);
    }
    throw mapped;
  }

  return (data ?? []).map(normalizeNote);
}

export async function getNoteById(id: string): Promise<Note | null> {
  if (demoMode) {
    return getDemoNotesStore().find((note) => note.id === id) ?? null;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("notes").select("*").eq("id", id).single();

  if (error) {
    if (error.code === "PGRST116") return null;
    console.error("[db] getNoteById failed:", error);
    const mapped = mapDatabaseError(error);
    if (demoMode && mapped.message.includes("Cannot reach Supabase host")) {
      console.warn("[db] Falling back to demo note store for getNoteById.");
      return getDemoNotesStore().find((note) => note.id === id) ?? null;
    }
    throw mapped;
  }

  return normalizeNote(data);
}

export async function deleteNoteById(id: string): Promise<boolean> {
  if (demoMode) {
    const store = getDemoNotesStore();
    const index = store.findIndex((note) => note.id === id);
    if (index === -1) return false;
    store.splice(index, 1);
    return true;
  }

  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("notes").delete().eq("id", id).select("id").maybeSingle();

  if (error) {
    console.error("[db] deleteNoteById failed:", error);
    throw mapDatabaseError(error);
  }

  return Boolean(data?.id);
}
