import { cn } from "@/lib/cn";
import {
  songStatusLabels,
  songStatusStyles,
  SONG_STATUSES,
} from "@/lib/song-status";

export function WorkflowStatusStrip({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        className,
      )}
    >
      <span className="text-[11px] font-medium tracking-wide text-subtle uppercase">
        Song workflow
      </span>
      {SONG_STATUSES.map((status) => {
        const style = songStatusStyles[status];
        return (
          <span
            key={status}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium",
              style.filterIdle,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
            {songStatusLabels[status]}
          </span>
        );
      })}
    </div>
  );
}
