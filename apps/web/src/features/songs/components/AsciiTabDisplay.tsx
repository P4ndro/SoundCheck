import { TabSectionNav } from "@/features/songs/components/TabSectionNav";
import { MEASURE_WIDTH } from "@/lib/tab-format";
import { cn } from "@/lib/cn";
import {
  buildContinuousTab,
  calcMeasuresPerRow,
  monospaceCharWidth,
  rowIndexForSection,
  rulerSpansForRow,
  sectionForMeasure,
  tabSectionId,
  wrapContinuousTab,
  type RulerSpan,
  type TabSectionSpan,
  type TabZoomLevel,
} from "@/lib/tab-layout";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

const TAB_LINE_RE = /^([A-GKSHBEe])\|(.*)$/;

function scrollTargetIntoContainer(
  container: HTMLElement,
  target: HTMLElement,
  behavior: ScrollBehavior = "smooth",
) {
  const containerRect = container.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  container.scrollTo({
    top: container.scrollTop + (targetRect.top - containerRect.top),
    behavior,
  });
}

function highlightTabContent(
  content: string,
  sectionSpans: TabSectionSpan[],
  rowStartMeasure: number,
): ReactNode[] {
  if (sectionSpans.length <= 1) {
    return highlightTokens(content);
  }

  const parts: ReactNode[] = [];
  let localMeasure = 0;
  const tokens = content.match(/\d+|[xo]|-+|\||[^xodh|\-\d]+/gi) ?? [content];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token === "|") {
      localMeasure++;
      const globalMeasure = rowStartMeasure + localMeasure;

      const isBoundary = sectionSpans.some(
        (span, idx) =>
          idx > 0 && globalMeasure === span.startMeasure,
      );

      if (isBoundary) {
        parts.push(
          <span key={`div-${i}`} className="text-accent/50">
            |
          </span>,
        );
        continue;
      }
    }

    parts.push(<span key={i}>{renderToken(token)}</span>);
  }

  return parts;
}

function renderToken(token: string): ReactNode {
  if (/^\d+$/.test(token)) {
    return <span className="font-semibold text-foreground">{token}</span>;
  }
  if (/^-+$/.test(token)) {
    return <span className="text-subtle/50">{token}</span>;
  }
  if (token === "|") {
    return <span className="text-subtle/70">|</span>;
  }
  if (token === "x" || token === "o") {
    return <span className="font-semibold text-accent-muted">{token}</span>;
  }
  return <span className="text-muted">{token}</span>;
}

function highlightTokens(content: string): ReactNode[] {
  const tokens = content.match(/\d+|[xo]|-+|\||[^xodh|\-\d]+/gi) ?? [content];
  return tokens.map((token, i) => (
    <span key={i}>{renderToken(token)}</span>
  ));
}

function SectionRuler({
  spans,
  fontSize,
}: {
  spans: RulerSpan[];
  fontSize: TabZoomLevel;
}) {
  if (spans.length === 0) return null;

  const charWidth = monospaceCharWidth(fontSize);
  const measureWidth = (MEASURE_WIDTH + 1) * charWidth;
  const labelWidth = 2 * charWidth;

  return (
    <div
      className="mb-1 flex max-w-full font-mono leading-none overflow-hidden"
      style={{ fontSize: fontSize - 2, paddingLeft: labelWidth }}
    >
      {spans.map((span, idx) => (
        <div
          key={`${span.label}-${idx}`}
          className={cn(
            "shrink-0 pl-1 text-[10px] font-medium tracking-wide text-subtle uppercase",
            idx > 0 && "border-l border-accent/25",
          )}
          style={{ width: span.measureCount * measureWidth }}
        >
          {span.label}
        </div>
      ))}
    </div>
  );
}

function TabStaffLine({
  line,
  fontSize,
  sectionSpans,
  rowStartMeasure,
}: {
  line: string;
  fontSize: TabZoomLevel;
  sectionSpans: TabSectionSpan[];
  rowStartMeasure: number;
}) {
  const parsed = line.match(TAB_LINE_RE);
  if (!parsed) {
    return (
      <div
        className="font-mono leading-none whitespace-pre"
        style={{ fontSize }}
      >
        {line}
      </div>
    );
  }

  const [, label, content] = parsed;
  return (
    <div className="font-mono leading-none whitespace-pre" style={{ fontSize }}>
      <span className="text-subtle">{label}|</span>
      {highlightTabContent(content, sectionSpans, rowStartMeasure)}
    </div>
  );
}

export interface AsciiTabDisplayProps {
  asciiTab: string;
  zoom?: TabZoomLevel;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export function AsciiTabDisplay({
  asciiTab,
  zoom = 13,
  scrollContainerRef,
  className,
}: AsciiTabDisplayProps) {
  const localScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = scrollContainerRef ?? localScrollRef;
  const [measuresPerRow, setMeasuresPerRow] = useState(4);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const continuous = useMemo(() => buildContinuousTab(asciiTab), [asciiTab]);
  const sectionLabels = continuous.sections.map((s) => s.label);

  const wrappedRows = useMemo(
    () => wrapContinuousTab(continuous, measuresPerRow),
    [continuous, measuresPerRow],
  );

  useEffect(() => {
    setActiveSection(sectionLabels[0] ?? null);
  }, [asciiTab, sectionLabels]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const update = (width: number) => {
      setMeasuresPerRow(calcMeasuresPerRow(width, zoom, 32));
    };

    update(el.clientWidth);

    const ro = new ResizeObserver((entries) => {
      update(entries[0].contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [zoom, scrollRef]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || wrappedRows.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length === 0) return;

        const startMeasure = Number(
          visible[0].target.getAttribute("data-start-measure") ?? 0,
        );
        const section = sectionForMeasure(continuous.sections, startMeasure);
        if (section) setActiveSection(section);
      },
      { root: container, rootMargin: "-10% 0px -55% 0px", threshold: 0 },
    );

    for (const row of container.querySelectorAll("[data-tab-row]")) {
      observer.observe(row);
    }

    return () => observer.disconnect();
  }, [wrappedRows, continuous.sections, scrollRef]);

  const handleSectionSelect = (section: string) => {
    setActiveSection(section);
    const span = continuous.sections.find((s) => s.label === section);
    if (!span) return;

    const rowIdx = rowIndexForSection(wrappedRows, span);
    if (rowIdx < 0) return;

    const container = scrollRef.current;
    const target = container?.querySelector(
      `#tab-row-${rowIdx}`,
    ) as HTMLElement | null;
    if (container && target) {
      scrollTargetIntoContainer(container, target);
    }
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
      <TabSectionNav
        sections={sectionLabels}
        activeSection={activeSection}
        onSelect={handleSectionSelect}
      />

      <div
        ref={scrollRef}
        className="scroll-smooth-touch min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-y-contain pr-1"
      >
        <div className="min-w-0 w-full max-w-full select-all overflow-hidden rounded-md border border-border bg-surface-1 px-4 py-3">
          {wrappedRows.map((row, rowIndex) => {
            const rulerSpans = rulerSpansForRow(
              continuous.sections,
              row.startMeasure,
              row.measureCount,
            );

            const sectionStart = continuous.sections.find(
              (s) =>
                s.startMeasure >= row.startMeasure &&
                s.startMeasure < row.startMeasure + row.measureCount,
            );

            return (
              <div
                key={rowIndex}
                id={`tab-row-${rowIndex}`}
                data-tab-row
                data-start-measure={row.startMeasure}
                className={cn(
                  rowIndex > 0 && "mt-4 border-t border-border-subtle/60 pt-4",
                )}
              >
                {sectionStart && (
                  <span
                    id={tabSectionId(sectionStart.label)}
                    className="sr-only"
                  >
                    {sectionStart.label}
                  </span>
                )}
                <SectionRuler spans={rulerSpans} fontSize={zoom} />
                {row.lines.map((line) => (
                  <TabStaffLine
                    key={`${rowIndex}-${line}`}
                    line={line}
                    fontSize={zoom}
                    sectionSpans={continuous.sections}
                    rowStartMeasure={row.startMeasure}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

