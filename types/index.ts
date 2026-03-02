export type NoteType = "note" | "link" | "insight";

export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  type: NoteType;
  tags: string[];
  source_url: string | null;
  created_at: string;
}

export interface AskResult {
  answer: string;
  sources: Array<{
    id: string;
    title: string;
    summary: string;
    created_at: string;
  }>;
}
