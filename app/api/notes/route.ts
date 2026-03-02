import { NextResponse } from "next/server";
import { createNoteWithAI, listNotes } from "@/lib/knowledge";
import type { NoteType } from "@/lib/types";
import { toTagArray } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const type = (searchParams.get("type") as NoteType | "all" | null) || "all";
    const tags = toTagArray(searchParams.get("tags"));
    const sort = searchParams.get("sort") === "asc" ? "asc" : "desc";
    const notes = await listNotes({ search, type, tags, sort });
    return NextResponse.json({ notes });
  } catch (error) {
    console.error("[/api/notes GET] Failed to load notes:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to load notes" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = String(body.title || "").trim();
    const content = String(body.content || "").trim();
    const type = (body.type as NoteType) || "note";

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
    }

    if (!["note", "link", "insight"].includes(type)) {
      return NextResponse.json({ error: "Invalid note type." }, { status: 400 });
    }

    const note = await createNoteWithAI({
      title,
      content,
      type,
      tags: body.tags,
      source_url: body.source_url
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("[/api/notes POST] Failed to create note:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to create note" }, { status: 500 });
  }
}
