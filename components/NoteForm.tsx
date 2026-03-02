"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload } from "lucide-react";
import type { NoteType } from "@/types";
import { ErrorBanner } from "@/components/ErrorBanner";
import { Toast } from "@/components/Toast";

const types: NoteType[] = ["note", "link", "insight"];

interface UploadedMeta {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  extractedChars: number;
}

export function NoteForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [uploadedText, setUploadedText] = useState("");
  const [uploadedMeta, setUploadedMeta] = useState<UploadedMeta | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "note" as NoteType,
    tags: "",
    source_url: ""
  });

  async function onFileSelected(file: File) {
    const isTextLike =
      file.type.startsWith("text/") ||
      /\.(txt|md|json|csv|log)$/i.test(file.name) ||
      file.type === "application/json" ||
      file.type === "text/csv";

    if (!isTextLike) {
      setError("Unsupported file type. Upload text-like files such as .txt, .md, .json, or .csv.");
      return;
    }

    const text = await file.text();
    const trimmed = text.slice(0, 12000);
    setUploadedText(trimmed);
    setUploadedMeta({
      fileName: file.name,
      mimeType: file.type || "unknown",
      sizeBytes: file.size,
      extractedChars: trimmed.length
    });
    setToast("File parsed. Metadata extracted and content is ready.");
    setTimeout(() => setToast(null), 2200);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setToast(null);

    const baseContent = formData.content.trim();
    const mergedContent = uploadedText
      ? `${baseContent}\n\n--- Uploaded Content ---\n${uploadedText}`.trim()
      : baseContent;
    const metadataBlock = uploadedMeta
      ? `\n\n--- File Metadata ---\nname: ${uploadedMeta.fileName}\nmime: ${uploadedMeta.mimeType}\nsize_bytes: ${uploadedMeta.sizeBytes}\nextracted_chars: ${uploadedMeta.extractedChars}`
      : "";

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          content: `${mergedContent}${metadataBlock}`.trim()
        }),
        cache: "no-store"
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to save note.");

      setToast("Note saved. AI summary and tags generated.");
      setFormData({ title: "", content: "", type: "note", tags: "", source_url: "" });
      setUploadedText("");
      setUploadedMeta(null);
      router.refresh();
      setTimeout(() => setToast(null), 2600);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message.includes("fetch failed") ? "Network error while saving note. Check backend and try again." : message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit} className="card-surface space-y-4 p-6" aria-label="Knowledge capture form">
        {error ? <ErrorBanner message={error} /> : null}

        <div>
          <label htmlFor="note-title" className="mb-1 block text-sm font-medium">
            Title *
          </label>
          <input
            id="note-title"
            aria-label="Note title"
            required
            value={formData.title}
            onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
            className="glass-input w-full"
            placeholder="React performance notes"
          />
        </div>

        <div>
          <label htmlFor="note-content" className="mb-1 block text-sm font-medium">
            Content *
          </label>
          <textarea
            id="note-content"
            aria-label="Note content"
            required
            value={formData.content}
            onChange={(event) => setFormData((prev) => ({ ...prev, content: event.target.value }))}
            className="glass-input min-h-36 w-full"
            placeholder="Capture your idea, article summary, or insight..."
          />
        </div>

        <div>
          <label htmlFor="file-upload" className="mb-1 block text-sm font-medium">
            Upload Document (optional)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="file-upload"
              aria-label="Upload supporting document"
              type="file"
              accept=".txt,.md,.json,.csv,.log,text/*,application/json"
              onChange={(event) => {
                setError(null);
                const file = event.target.files?.[0];
                if (file) {
                  onFileSelected(file).catch(() => setError("Failed to read selected file."));
                }
              }}
              className="glass-input w-full md:max-w-sm"
            />
            <span className="inline-flex items-center text-xs text-slate-300">
              <Upload className="mr-1 h-3.5 w-3.5" />
              Extracts text + metadata for knowledge capture
            </span>
          </div>
          {uploadedMeta ? (
            <p className="mt-2 text-xs text-cyan-100">
              File: {uploadedMeta.fileName} ({uploadedMeta.sizeBytes} bytes), extracted {uploadedMeta.extractedChars} chars
            </p>
          ) : null}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="note-type" className="mb-1 block text-sm font-medium">
              Type
            </label>
            <select
              id="note-type"
              aria-label="Note type"
              value={formData.type}
              onChange={(event) => setFormData((prev) => ({ ...prev, type: event.target.value as NoteType }))}
              className="glass-input w-full"
            >
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="note-tags" className="mb-1 block text-sm font-medium">
              Tags
            </label>
            <input
              id="note-tags"
              aria-label="Tags"
              value={formData.tags}
              onChange={(event) => setFormData((prev) => ({ ...prev, tags: event.target.value }))}
              className="glass-input w-full"
              placeholder="react, frontend, performance"
            />
          </div>
        </div>

        <div>
          <label htmlFor="source-url" className="mb-1 block text-sm font-medium">
            Source URL
          </label>
          <input
            id="source-url"
            aria-label="Source URL"
            type="url"
            value={formData.source_url}
            onChange={(event) => setFormData((prev) => ({ ...prev, source_url: event.target.value }))}
            className="glass-input w-full"
            placeholder="https://example.com/article"
          />
        </div>

        <button
          aria-label="Save note"
          disabled={loading}
          className="inline-flex items-center rounded-2xl bg-cyan-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:brightness-95 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Note"
          )}
        </button>
      </form>
      <Toast message={toast} />
    </>
  );
}
