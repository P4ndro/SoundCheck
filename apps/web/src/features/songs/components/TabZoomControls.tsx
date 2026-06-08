import { Button } from "@/components/ui/Button";
import {
  DEFAULT_TAB_ZOOM,
  TAB_ZOOM_LEVELS,
  type TabZoomLevel,
} from "@/lib/tab-layout";
import { cn } from "@/lib/cn";
import { ZoomIn, ZoomOut } from "lucide-react";

export interface TabZoomControlsProps {
  zoom: TabZoomLevel;
  onChange: (zoom: TabZoomLevel) => void;
  className?: string;
}

export function TabZoomControls({
  zoom,
  onChange,
  className,
}: TabZoomControlsProps) {
  const index = TAB_ZOOM_LEVELS.indexOf(zoom);
  const canZoomOut = index < TAB_ZOOM_LEVELS.length - 1;
  const canZoomIn = index > 0;

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md border border-border bg-surface-1 p-0.5",
        className,
      )}
      role="group"
      aria-label="Tab zoom"
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0"
        disabled={!canZoomOut}
        onClick={() => onChange(TAB_ZOOM_LEVELS[index + 1] ?? zoom)}
        aria-label="Zoom out — fit more on screen"
        title="Zoom out"
      >
        <ZoomOut className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Button>
      <span className="min-w-[3rem] px-1 text-center text-xs font-medium text-muted">
        {zoom}px
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 px-0"
        disabled={!canZoomIn}
        onClick={() => onChange(TAB_ZOOM_LEVELS[index - 1] ?? zoom)}
        aria-label="Zoom in — larger notation"
        title="Zoom in"
      >
        <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.75} />
      </Button>
    </div>
  );
}

export { DEFAULT_TAB_ZOOM };
