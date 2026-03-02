import type { Note } from "@/types";
import { getOpenAIClient } from "@/lib/openaiClient";

const GEMINI_MODEL = "gemini-1.5-flash";

function isModelNotFoundError(error: any): boolean {
  const status = Number(error?.status || 0);
  const message = String(error?.message || "").toLowerCase();
  return status === 404 || message.includes("model") && message.includes("not found");
}

export async function askGemini(prompt: string): Promise<string> {
  const genAI = getOpenAIClient();
  const modelCandidates = [GEMINI_MODEL, "gemini-1.5-flash-latest", "gemini-2.0-flash", "gemini-2.0-flash-lite"];
  let lastError: any = null;

  for (const modelName of modelCandidates) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (!text || !text.trim()) {
        throw new Error("Gemini returned an empty response.");
      }
      return text;
    } catch (error: any) {
      lastError = error;
      if (isModelNotFoundError(error)) {
        console.warn(`[gemini] Model '${modelName}' unavailable. Trying fallback model...`);
        continue;
      }

      console.error("[gemini] askGemini failed:", error);
      const status = Number(error?.status || 0);
      const message = String(error?.message || "");
      if (status === 429 || message.toLowerCase().includes("quota")) {
        throw new Error("Gemini quota exceeded. Check your billing/quota for GEMINI_API_KEY.");
      }
      if (status === 401 || message.toLowerCase().includes("api key")) {
        throw new Error("Gemini authentication failed. Check GEMINI_API_KEY.");
      }
      throw new Error(`Gemini request failed: ${message || "Unknown Gemini error"}`);
    }
  }

  console.error("[gemini] No compatible Gemini model was available for generateContent.", lastError);
  try {
    const message = String(lastError?.message || "");
    throw new Error(
      `Gemini request failed: no compatible model available for this API key/project. Last error: ${message || "unknown"}`
    );
  } catch (error) {
    throw error;
  }
}

export async function generateSummaryAndTags(content: string): Promise<{ summary: string; tags: string[] }> {
  const prompt = `You summarize notes and generate tags.
Return strict JSON only with keys:
- summary: concise string
- tags: array of 3 to 8 lowercase tags

Note content:
${content}`;

  const raw = await askGemini(prompt);
  let parsed: { summary?: string; tags?: string[] } = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = {};
      }
    }
  }

  const summary = (parsed.summary || content.slice(0, 240)).trim();
  const tags = Array.isArray(parsed.tags)
    ? parsed.tags
        .map((tag) => String(tag).toLowerCase().trim())
        .filter(Boolean)
        .slice(0, 8)
    : [];

  return { summary, tags };
}

export async function generateGroundedAnswer(question: string, notes: Note[]): Promise<string> {
  const notesContent = notes.map((n) => `${n.title}: ${n.content}`).join("\n");
  const prompt = `Answer the user's question using the following notes as context.

Notes:
${notesContent}

Question:
${question}

Give a clear helpful answer.`;

  return askGemini(prompt);
}
