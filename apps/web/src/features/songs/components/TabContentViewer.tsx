import { ContentPanel } from "@/components/shared/ContentPanel";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { AsciiTabDisplay } from "@/features/songs/components/AsciiTabDisplay";
import { ChordChartDisplay } from "@/features/songs/components/ChordChartDisplay";
import {
  DEFAULT_TAB_ZOOM,
  TabZoomControls,
} from "@/features/songs/components/TabZoomControls";
import { cn } from "@/lib/cn";
import type { TabZoomLevel } from "@/lib/tab-layout";
import { roleLabels } from "@/lib/roles";
import type { Instrument, InstrumentTab } from "@/types";
import { AlignLeft, FileMusic } from "lucide-react";
import { useRef, useState } from "react";

type NotationMode = "ascii" | "chords";

export interface TabContentViewerProps {
  tabs: InstrumentTab[];
  selectedInstrument?: Instrument;
  onInstrumentChange?: (instrument: Instrument) => void;
  showInstrumentPicker?: boolean;
  showZoom?: boolean;
  wide?: boolean;
  fillHeight?: boolean;
  className?: string;
}

export function TabContentViewer({
  tabs,
  selectedInstrument,
  onInstrumentChange,
  showInstrumentPicker = true,
  showZoom = false,
  wide = false,
  fillHeight = false,
  className,
}: TabContentViewerProps) {
  const [notationMode, setNotationMode] = useState<NotationMode>("ascii");
  const [zoom, setZoom] = useState<TabZoomLevel>(DEFAULT_TAB_ZOOM);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTab =
    tabs.find((tab) => tab.instrument === selectedInstrument) ?? tabs[0];

  if (!activeTab) {
    return (
      <ContentPanel>
        <p className="py-8 text-center text-sm text-muted">
          No notation for this instrument yet.
        </p>
      </ContentPanel>
    );
  }

  const panelTitle = notationMode === "ascii" ? "Tab" : "Chords";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        wide && "w-full",
        fillHeight && "h-full min-h-0 overflow-hidden",
        className,
      )}
    >
      {showInstrumentPicker && tabs.length > 1 && onInstrumentChange && (
        <div className="flex shrink-0 flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onInstrumentChange(tab.instrument)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                activeTab.instrument === tab.instrument
                  ? "border-accent/40 bg-accent-subtle text-foreground"
                  : "border-border bg-surface-1 text-muted hover:border-border-subtle hover:text-foreground",
              )}
            >
              {roleLabels[tab.instrument]}
            </button>
          ))}
        </div>
      )}

      <ContentPanel
        title={panelTitle}
        fill={fillHeight}
        bodyRef={fillHeight ? scrollRef : undefined}
        className={cn(
          wide && "w-full",
          fillHeight && "flex h-0 min-h-0 flex-1 flex-col overflow-hidden",
        )}
        bodyClassName={
          fillHeight ? "flex min-h-0 flex-1 flex-col overflow-hidden p-0" : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            {showZoom && notationMode === "ascii" && (
              <TabZoomControls zoom={zoom} onChange={setZoom} />
            )}
            <ViewToggle
              value={notationMode}
              onChange={setNotationMode}
              options={[
                { value: "ascii", label: "Tab", icon: FileMusic },
                { value: "chords", label: "Chords", icon: AlignLeft },
              ]}
            />
          </div>
        }
      >
        {notationMode === "ascii" ? (
          <AsciiTabDisplay
            asciiTab={activeTab.asciiTab}
            zoom={zoom}
            scrollContainerRef={fillHeight ? scrollRef : undefined}
            className={fillHeight ? "min-h-0 flex-1" : undefined}
          />
        ) : (
          <ChordChartDisplay chordChart={activeTab.chordChart} />
        )}
      </ContentPanel>
    </div>
  );
}

