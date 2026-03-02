import { NextResponse } from "next/server";
import { deleteNoteById, getNoteById } from "@/lib/knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const note = await getNoteById(params.id);
    if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    return NextResponse.json({ note });
  } catch (error) {
    console.error("[/api/notes/:id] Failed to fetch note:", error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteNoteById(params.id);
    if (!deleted) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[/api/notes/:id DELETE] Failed to delete note:", error);
    return NextResponse.json({ error: (error as Error).message || "Failed to delete note" }, { status: 500 });
  }
}
