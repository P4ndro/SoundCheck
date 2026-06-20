import { cn } from "@/lib/cn";

export function AuthLoadingScreen({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-screen flex-col items-center justify-center gap-3 bg-background px-6",
        className,
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-sm text-muted">Loading workspace…</p>
    </div>
  );
}
