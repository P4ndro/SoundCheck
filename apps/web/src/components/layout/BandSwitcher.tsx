import { useActiveBand } from "@/hooks/useActiveBand";
import { useSession } from "@/hooks/useSession";
import { cn } from "@/lib/cn";
import { roleLabels } from "@/lib/roles";
import { Check, ChevronsUpDown, Plus, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface BandSwitcherProps {
  onCreateBand: () => void;
  onJoinBand: () => void;
}

export function BandSwitcher({ onCreateBand, onJoinBand }: BandSwitcherProps) {
  const { bands, activeBand, setActiveBandId } = useActiveBand();
  const { session } = useSession();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!session || !activeBand) return null;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex max-w-[220px] items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5",
          "text-left text-sm hover:border-accent/40",
          open && "border-accent/40",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Users className="h-4 w-4 shrink-0 text-subtle" />
        <span className="min-w-0 flex-1 truncate font-medium text-foreground">
          {activeBand.name}
        </span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-subtle" />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 z-50 mt-2 w-72 rounded-lg border border-border bg-surface-2 py-1 shadow-xl"
          role="listbox"
          aria-label="Switch band"
        >
          <p className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-subtle">
            Your bands
          </p>

          {bands.map((band) => {
            const isActive = band.id === activeBand.id;
            const roleLabel =
              band.role in roleLabels
                ? roleLabels[band.role as keyof typeof roleLabels]
                : band.role;

            return (
              <button
                key={band.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setActiveBandId(band.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                  isActive
                    ? "bg-accent-subtle text-foreground"
                    : "text-muted hover:bg-surface-1 hover:text-foreground",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{band.name}</span>
                  <span className="block truncate text-xs text-subtle">
                    {roleLabel}
                  </span>
                </span>
                {isActive && <Check className="h-4 w-4 shrink-0 text-accent" />}
              </button>
            );
          })}

          <div className="my-1 border-t border-border" />

          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onCreateBand();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted hover:bg-surface-1 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Create new band
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onJoinBand();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted hover:bg-surface-1 hover:text-foreground"
          >
            <Users className="h-4 w-4" />
            Join another band
          </button>
        </div>
      )}
    </div>
  );
}
