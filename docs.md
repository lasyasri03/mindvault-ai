# Second Brain AI Knowledge System - Architecture Notes

## 1) Portable Architecture

The project is designed as four separable layers:

- UI layer (`app/*`, `components/*`): Next.js App Router pages and interactive components render the product experience.
- API layer (`app/api/*`): Route handlers expose internal and public interfaces while validating payloads and shaping responses.
- AI layer (`lib/gemini.ts`, `lib/knowledge.ts`): Gemini operations are centralized server-side for summarization, auto-tagging, and grounded Q&A.
- Database layer (`lib/db.ts`, `supabase/schema.sql`): Supabase/PostgreSQL stores structured notes and supports filtering/search indexing.

This keeps AI/provider code replaceable and lets you evolve frontend and API independently.

## 2) UX Design Principles

### Fast Capture

- `/add-note` prioritizes a single card form with only critical fields required.
- Minimal branching and clear defaults reduce cognitive load.

### Minimal Friction

- Dashboard has fast text search, type/tag filters, and date sorting in one surface.
- Card layouts keep scanability high on desktop and mobile.

### AI Assistance

- Notes are enriched automatically with summary + tags.
- `/ask` lets users retrieve knowledge conversationally without crafting complex queries.

## 3) Agent Thinking

Automation behavior:

- Auto summaries: every saved note is compressed into a practical short summary.
- Auto tagging: AI derives topical tags from content and merges them with user tags.
- Intelligent search: question token matching and recency weighting choose relevant sources before answer generation.

## 4) Infrastructure Thinking

Public endpoint:

- `GET /api/public/brain/query?q=question`

Response contract:

```json
{
  "answer": "string",
  "sources": [
    {
      "id": "uuid",
      "title": "string",
      "summary": "string",
      "created_at": "timestamp"
    }
  ]
}
```

This endpoint demonstrates reusable backend intelligence for future SDKs, bots, or third-party integrations beyond the web UI.
