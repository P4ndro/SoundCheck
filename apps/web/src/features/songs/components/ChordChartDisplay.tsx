import { cn } from "@/lib/cn";

const CHORD_RE =
  /\b([A-G](?:#|b)?(?:m|maj|min|dim|aug|sus[24]?|add\d+|\d)?[0-9]*)\b/g;

const notationSheetClass =
  "rounded-md border border-border bg-surface-1 px-4 py-4";

function highlightChords(text: string) {
  const parts: { text: string; chord: boolean }[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(CHORD_RE)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, index), chord: false });
    }
    parts.push({ text: match[0], chord: true });
    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), chord: false });
  }

  if (parts.length === 0) {
    return <span>{text}</span>;
  }

  return (
    <>
      {parts.map((part, i) =>
        part.chord ? (
          <span
            key={i}
            className="font-mono font-semibold text-foreground"
          >
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  );
}

export interface ChordChartDisplayProps {
  chordChart: string;
  className?: string;
}

export function ChordChartDisplay({
  chordChart,
  className,
}: ChordChartDisplayProps) {
  const lines = chordChart
    .trim()
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return (
    <div className={cn(notationSheetClass, "select-all", className)}>
      {lines.map((line, index) => {
        const colonIndex = line.indexOf(":");
        if (colonIndex > 0) {
          const section = line.slice(0, colonIndex).trim();
          const body = line.slice(colonIndex + 1).trim();

          return (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-1 py-2 sm:flex-row sm:items-baseline sm:gap-4",
                index > 0 && "border-t border-border-subtle",
              )}
            >
              <span className="shrink-0 text-sm text-subtle sm:w-28">
                {section}
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                {highlightChords(body)}
              </p>
            </div>
          );
        }

        return (
          <p key={index} className="py-1 text-sm leading-relaxed text-foreground">
            {highlightChords(line)}
          </p>
        );
      })}
    </div>
  );
}
