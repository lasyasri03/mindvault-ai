export function LoadingSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card-surface animate-pulse p-5">
          <div className="mb-3 h-4 w-2/3 rounded bg-white/20" />
          <div className="mb-2 h-3 w-full rounded bg-white/10" />
          <div className="mb-2 h-3 w-5/6 rounded bg-white/10" />
          <div className="h-3 w-1/3 rounded bg-white/20" />
        </div>
      ))}
    </div>
  );
}
