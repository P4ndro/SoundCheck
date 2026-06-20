import { cn } from "@/lib/cn";

export function PublicPageBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="public-page-grid absolute inset-0" />
      <div className="absolute -top-24 right-[8%] h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute top-[38%] -left-16 h-40 w-40 rounded-full bg-status-warning/6 blur-3xl" />
      <div className="absolute right-[22%] bottom-[12%] h-36 w-36 rounded-full bg-status-success/5 blur-3xl" />
    </div>
  );
}
