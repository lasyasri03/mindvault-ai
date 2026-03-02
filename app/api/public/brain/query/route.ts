import { NextResponse } from "next/server";
import { askKnowledgeBase } from "@/lib/knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const question = searchParams.get("q")?.trim() || "";

    if (!question) {
      return NextResponse.json({ error: "Missing query parameter: q" }, { status: 400 });
    }

    const result = await askKnowledgeBase(question);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/public/brain/query] Failed to query public endpoint:", error);
    return NextResponse.json({ error: (error as Error).message || "AI request failed" }, { status: 500 });
  }
}
