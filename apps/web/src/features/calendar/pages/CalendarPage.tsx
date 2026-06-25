import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarNav } from "@/features/calendar/components/CalendarNav";
import { EventDetailModal } from "@/features/calendar/components/EventDetailModal";
import { ScheduleEventModal } from "@/features/calendar/components/ScheduleEventModal";
import { useToast } from "@/providers/ToastProvider";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  toDateKey,
  WEEKDAY_LABELS,
} from "@/features/calendar/lib/calendar-utils";
import { Button } from "@/components/ui/Button";
import {
  eventTypeBadgeStyles,
  eventTypeCardStyles,
  eventTypeChipStyles,
  eventTypeLabels,
} from "@/lib/event-type";
import { formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import { useActionSearchParam } from "@/hooks/useActionSearchParam";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { getUpcomingEvents } from "@/lib/sidebar-insights";
import type { BandEvent } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function CalendarPage() {
  const { events, getSetlist, setlists, addEvent } = useBandWorkspace();
  const { toast } = useToast();
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedEvent, setSelectedEvent] = useState<BandEvent | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  useActionSearchParam("schedule", setScheduleOpen);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const goToMonth = (y: number, m: number) => {
    setViewDate(new Date(y, m, 1));
  };

  const eventsByDay = useMemo(() => {
    const map = new Map<string, BandEvent[]>();

    for (const event of events) {
      const date = new Date(event.start);
      const key = toDateKey(date);
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, event]);
    }

    return map;
  }, [events]);

  const upcomingEvents = useMemo(
    () => getUpcomingEvents(events, 5),
    [events],
  );

  const calendarCells: Array<{ day: number | null; date?: Date }> = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push({ day: null });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push({ day, date: new Date(year, month, day) });
  }

  const selectedSetlistName = selectedEvent?.setlistId
    ? getSetlist(selectedEvent.setlistId)?.name
    : undefined;

  return (
    <div>
      <PageHeader
        description="Rehearsals, gigs, and band meetings — with linked setlists."
        actions={
          <Button onClick={() => setScheduleOpen(true)}>
            <Plus className="h-4 w-4" />
            Schedule event
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 px-6 py-5 xl:grid-cols-[1fr_280px]">
        <section>
          <CalendarNav
            month={month}
            year={year}
            isCurrentMonth={isCurrentMonth}
            onMonthChange={(m) => goToMonth(year, m)}
            onYearChange={(y) => goToMonth(y, month)}
            onPrevMonth={() => goToMonth(year, month - 1)}
            onNextMonth={() => goToMonth(year, month + 1)}
            onToday={() =>
              goToMonth(today.getFullYear(), today.getMonth())
            }
          />

          <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted">
            <LegendDot className="bg-violet-300" label="Rehearsal" />
            <LegendDot className="bg-emerald-400" label="Gig" />
            <LegendDot className="bg-zinc-400" label="Meeting" />
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-7 border-b border-border bg-surface-2">
              {WEEKDAY_LABELS.map((label) => (
                <div
                  key={label}
                  className="px-2 py-2 text-center text-xs font-medium text-subtle"
                >
                  {label}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {calendarCells.map((cell, index) => {
                if (!cell.day || !cell.date) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="min-h-24 border-b border-r border-border-subtle bg-surface-1/40"
                    />
                  );
                }

                const key = toDateKey(cell.date);
                const dayEvents = eventsByDay.get(key) ?? [];
                const isToday = isSameDay(cell.date, today);

                return (
                  <div
                    key={key}
                    className="min-h-24 border-b border-r border-border-subtle bg-surface-1 p-1.5"
                  >
                    <span
                      className={cn(
                        "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs",
                        isToday
                          ? "bg-accent font-semibold text-foreground"
                          : "text-muted",
                      )}
                    >
                      {cell.day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setSelectedEvent(event)}
                          className={cn(
                            "block w-full truncate rounded-r px-1.5 py-0.5 text-left text-[11px] font-medium",
                            eventTypeChipStyles[event.type],
                          )}
                        >
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="px-1 text-[10px] text-subtle">
                          +{dayEvents.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <aside>
          <h3 className="mb-3 text-sm font-medium text-foreground">Upcoming</h3>
          <div className="space-y-2">
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted">No upcoming events.</p>
            ) : (
              upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => setSelectedEvent(event)}
                  className={cn(
                    "w-full rounded-lg border p-3 text-left transition-colors",
                    eventTypeCardStyles[event.type],
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase",
                        eventTypeBadgeStyles[event.type],
                      )}
                    >
                      {eventTypeLabels[event.type]}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-subtle">
                    {formatDate(event.start)} · {formatTime(event.start)}
                  </p>
                </button>
              ))
            )}
          </div>
        </aside>
      </div>

      <EventDetailModal
        event={selectedEvent}
        setlistName={selectedSetlistName}
        onClose={() => setSelectedEvent(null)}
      />

      <ScheduleEventModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        setlists={setlists}
        onSubmit={(data) => {
          setScheduleOpen(false);
          void Promise.resolve(addEvent(data))
            .then((event) => {
              toast(`"${event.title}" scheduled`);
              const eventMonth = new Date(event.start);
              setViewDate(
                new Date(eventMonth.getFullYear(), eventMonth.getMonth(), 1),
              );
            })
            .catch(() => {
              toast("Could not schedule event");
            });
        }}
      />
    </div>
  );
}

function LegendDot({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2 w-2 rounded-full", className)} />
      {label}
    </span>
  );
}
