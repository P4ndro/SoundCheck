import { MEASURE_WIDTH } from "@/lib/tab-format";

const TAB_LINE_RE = /^([A-GKSHBEe])\|(.*)$/;
const SECTION_RE = /^\[([^\]]+)\]$/;

export const TAB_ZOOM_LEVELS = [11, 13, 15, 17] as const;
export type TabZoomLevel = (typeof TAB_ZOOM_LEVELS)[number];
export const DEFAULT_TAB_ZOOM: TabZoomLevel = 13;

export interface TabSectionSpan {
  label: string;
  startMeasure: number;
  measureCount: number;
}

export interface ContinuousTab {
  staffLines: string[];
  stringLabels: string[];
  sections: TabSectionSpan[];
}

export interface WrappedStaffRow {
  lines: string[];
  startMeasure: number;
  measureCount: number;
}

export interface RulerSpan {
  label: string;
  measureCount: number;
}

function parseMeasures(content: string): string[] {
  const parts = content.split("|");
  if (parts.length > 0 && parts[parts.length - 1] === "") {
    parts.pop();
  }
  return parts;
}

function parseTabStructure(asciiTab: string) {
  const sections: {
    label: string;
    lines: Map<string, string[]>;
  }[] = [];

  let current: { label: string; lines: Map<string, string[]> } | null = null;

  for (const line of parseTabLines(asciiTab)) {
    const section = isSectionLine(line);
    if (section) {
      current = { label: section, lines: new Map() };
      sections.push(current);
      continue;
    }

    const tab = line.match(TAB_LINE_RE);
    if (!tab || !current) continue;

    const [, label, content] = tab;
    const measures = parseMeasures(content);
    if (!current.lines.has(label)) {
      current.lines.set(label, []);
    }
    current.lines.get(label)!.push(...measures);
  }

  return sections;
}

export function buildContinuousTab(asciiTab: string): ContinuousTab {
  const sections = parseTabStructure(asciiTab);

  if (sections.length === 0) {
    const staffLines = parseTabLines(asciiTab).filter(isTabLine);
    const labels = staffLines.map((line) => line.match(TAB_LINE_RE)![1]);
    return { staffLines, stringLabels: labels, sections: [] };
  }

  const stringLabels = Array.from(sections[0].lines.keys());
  const merged = new Map<string, string[]>();
  for (const label of stringLabels) {
    merged.set(label, []);
  }

  const spans: TabSectionSpan[] = [];
  let measureOffset = 0;

  for (const section of sections) {
    const counts = stringLabels.map(
      (label) => section.lines.get(label)?.length ?? 0,
    );
    const measureCount = Math.max(...counts, 0);

    spans.push({
      label: section.label,
      startMeasure: measureOffset,
      measureCount,
    });

    for (const label of stringLabels) {
      const measures = section.lines.get(label) ?? [];
      merged.get(label)!.push(...measures);
    }

    measureOffset += measureCount;
  }

  const staffLines = stringLabels.map(
    (label) => `${label}|${merged.get(label)!.join("|")}|`,
  );

  return { staffLines, stringLabels, sections: spans };
}

export function monospaceCharWidth(fontSize: number): number {
  return fontSize * 0.602;
}

export function calcMeasuresPerRow(
  containerWidth: number,
  fontSize: number,
  paddingPx = 40,
): number {
  if (containerWidth <= 0) return 4;

  const charWidth = monospaceCharWidth(fontSize);
  const measureChars = MEASURE_WIDTH + 1;
  const labelChars = 2;
  const available = containerWidth - paddingPx - labelChars * charWidth;
  return Math.max(1, Math.floor(available / (measureChars * charWidth)));
}

export function wrapContinuousTab(
  continuous: ContinuousTab,
  measuresPerRow: number,
): WrappedStaffRow[] {
  const measureMaps = continuous.stringLabels.map((_, i) => {
    const m = continuous.staffLines[i].match(TAB_LINE_RE);
    return parseMeasures(m![2]);
  });

  const total = Math.max(...measureMaps.map((m) => m.length), 0);
  const rows: WrappedStaffRow[] = [];

  for (let start = 0; start < total; start += measuresPerRow) {
    const lines: string[] = [];

    for (let i = 0; i < continuous.stringLabels.length; i++) {
      const slice = measureMaps[i].slice(start, start + measuresPerRow);
      if (slice.length === 0) continue;
      lines.push(`${continuous.stringLabels[i]}|${slice.join("|")}|`);
    }

    if (lines.length > 0) {
      rows.push({
        lines,
        startMeasure: start,
        measureCount: Math.min(measuresPerRow, total - start),
      });
    }
  }

  return rows;
}

export function rulerSpansForRow(
  sections: TabSectionSpan[],
  rowStart: number,
  rowCount: number,
): RulerSpan[] {
  const rowEnd = rowStart + rowCount;
  const spans: RulerSpan[] = [];

  for (const sec of sections) {
    const secEnd = sec.startMeasure + sec.measureCount;
    const overlapStart = Math.max(rowStart, sec.startMeasure);
    const overlapEnd = Math.min(rowEnd, secEnd);
    const overlap = overlapEnd - overlapStart;
    if (overlap > 0) {
      spans.push({ label: sec.label, measureCount: overlap });
    }
  }

  return spans;
}

export function sectionForMeasure(
  sections: TabSectionSpan[],
  measureIndex: number,
): string | null {
  for (let i = sections.length - 1; i >= 0; i--) {
    if (measureIndex >= sections[i].startMeasure) {
      return sections[i].label;
    }
  }
  return sections[0]?.label ?? null;
}

export function rowIndexForSection(
  rows: WrappedStaffRow[],
  section: TabSectionSpan,
): number {
  return rows.findIndex(
    (row) =>
      section.startMeasure >= row.startMeasure &&
      section.startMeasure < row.startMeasure + row.measureCount,
  );
}

export function parseTabLines(asciiTab: string): string[] {
  return asciiTab
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function parseTabSections(asciiTab: string): string[] {
  return buildContinuousTab(asciiTab).sections.map((s) => s.label);
}

export function tabSectionId(label: string): string {
  return `tab-section-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}

export function isSectionLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const bracket = trimmed.match(SECTION_RE);
  if (bracket) return bracket[1];

  if (!trimmed.includes("|") && !TAB_LINE_RE.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function isTabLine(line: string): boolean {
  return TAB_LINE_RE.test(line.trim());
}
