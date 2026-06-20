export function AuthClerkFallback() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div className="h-7 w-7 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-sm text-muted">Loading…</p>
    </div>
  );
}
