import Link from "next/link";

const sections = [
  {
    title: "Portable Architecture",
    body: "UI, API, AI, and database layers are separated for maintainability and provider portability."
  },
  {
    title: "UX Principles",
    body: "Fast capture, minimal friction, and AI assistance keep the knowledge workflow practical."
  },
  {
    title: "Infrastructure",
    body: "Public query endpoint demonstrates API product thinking beyond the frontend."
  }
];

export default function DocsPage() {
  return (
    <main className="space-y-6">
      <header>
        <h1 className="text-4xl text-slate-100">Project Docs</h1>
        <p className="mt-2 text-sm text-slate-300">Architecture and design rationale for Second Brain AI.</p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <article key={section.title} className="card-surface p-5">
            <h2 className="mb-2 text-2xl text-slate-100">{section.title}</h2>
            <p className="text-sm text-slate-300">{section.body}</p>
          </article>
        ))}
      </section>
      <Link href="/" className="text-sm text-cyan-200 underline-offset-4 hover:underline">
        Full architecture notes are in `docs.md` at project root
      </Link>
    </main>
  );
}
