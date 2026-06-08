import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { MONTH_LABELS } from "@/features/calendar/lib/calendar-utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarNavProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  isCurrentMonth: boolean;
}

const YEAR_RANGE = 5;

function buildYearOptions(centerYear: number): number[] {
  const years: number[] = [];
  for (let y = centerYear - YEAR_RANGE; y <= centerYear + YEAR_RANGE; y++) {
    years.push(y);
  }
  return years;
}

export function CalendarNav({
  month,
  year,
  onMonthChange,
  onYearChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  isCurrentMonth,
}: CalendarNavProps) {
  const years = buildYearOptions(new Date().getFullYear());

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
          aria-label="Select month"
          className={cn(
            "h-9 rounded-md border border-border bg-surface-2 px-3 text-sm font-medium text-foreground",
            "hover:border-border-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-subtle",
          )}
        >
          {MONTH_LABELS.map((label, index) => (
            <option key={label} value={index}>
              {label}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          aria-label="Select year"
          className={cn(
            "h-9 rounded-md border border-border bg-surface-2 px-3 text-sm font-medium text-foreground",
            "hover:border-border-subtle focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-subtle",
          )}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        <Button
          variant="secondary"
          size="sm"
          onClick={onToday}
          disabled={isCurrentMonth}
        >
          Today
        </Button>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextMonth}
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
