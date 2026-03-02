# Second Brain AI Knowledge System

AI-powered full-stack knowledge management built with Next.js 14, Supabase PostgreSQL, and Google Gemini.

## Overview

Second Brain AI lets users capture notes, links, and insights, then query their own knowledge base conversationally. Each note is enriched server-side with:

- AI-generated concise summary
- AI auto-tagging
- searchable metadata for retrieval

## Architecture

- Frontend: Next.js App Router + React + Tailwind + Framer Motion
- Backend: Next.js Route Handlers (`app/api/*`)
- AI Services: centralized in `lib/gemini.ts` and `lib/knowledge.ts`
- Data: Supabase PostgreSQL (`notes` table + indexes)

Reference docs: [docs.md](./docs.md)

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- Supabase (PostgreSQL)
- Google Gemini API
- Vercel deployment compatible

## Project Structure

```text
second-brain-ai
├── app
│   ├── page.tsx
│   ├── add-note/page.tsx
│   ├── ask/page.tsx
│   ├── dashboard/page.tsx
│   ├── docs/page.tsx
│   └── api/...
├── components
│   ├── NoteCard.tsx
│   ├── SearchBar.tsx
│   ├── NoteForm.tsx
│   └── LoadingSkeleton.tsx
├── lib
│   ├── db.ts
│   ├── gemini.ts
│   ├── knowledge.ts
│   ├── types.ts
│   └── utils.ts
├── styles
├── supabase/schema.sql
├── README.md
├── docs.md
└── .env.example
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

3. Fill env values:

```env
GEMINI_API_KEY=your_gemini_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Apply DB schema in Supabase SQL editor:

- Run `supabase/schema.sql`

5. Start development server:

```bash
npm run dev
```

## Environment Variables

- `GEMINI_API_KEY`: Gemini key (server-side only)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

## API Endpoints

- `GET /api/notes` - list notes with filters
- `POST /api/notes` - create note + AI summary + AI tags
- `POST /api/ask` - conversational answer from stored notes
- `GET /api/public/brain/query?q=...` - public read-only query endpoint

## Deployment (Vercel)

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add environment variables in Vercel project settings.
4. Deploy.

No extra server process is required; all logic runs in Next.js routes.
