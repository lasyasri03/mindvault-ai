import { NextResponse } from "next/server";
import { askKnowledgeBase } from "@/lib/knowledge";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = String(body.question || "").trim();

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const result = await askKnowledgeBase(question);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[/api/ask] Failed to answer question:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Gemini request failed", answer: "", sources: [] },
      { status: 500 }
    );
  }
}
