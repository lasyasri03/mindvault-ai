create extension if not exists "pgcrypto";

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  summary text,
  type text not null check (type in ('note', 'link', 'insight')),
  tags jsonb not null default '[]'::jsonb,
  source_url text,
  created_at timestamptz not null default now()
);

create index if not exists notes_created_at_idx on public.notes (created_at desc);
create index if not exists notes_type_idx on public.notes (type);
create index if not exists notes_tags_gin_idx on public.notes using gin (tags jsonb_path_ops);
create index if not exists notes_content_tsv_idx on public.notes using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(summary, ''))
);

