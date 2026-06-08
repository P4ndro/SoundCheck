import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { Textarea } from "@/components/ui/Textarea";
import {
  EVENT_TYPES,
  eventTypeLabels,
  eventTypePickerStyles,
} from "@/lib/event-type";
import { cn } from "@/lib/cn";
import type { EventType, Setlist } from "@/types";
import { CalendarDays, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export interface ScheduleEventPayload {
  title: string;
  type: EventType;
  start: string;
  end: string;
  location: string;
  notes: string;
  setlistId?: string;
}

export interface ScheduleEventModalProps {
  open: boolean;
  onClose: () => void;
  setlists: Setlist[];
  onSubmit: (event: ScheduleEventPayload) => void;
}

function toIsoDateTime(date: string, time: string): string {
  return new Date(`${date}T${time}`).toISOString();
}

export function ScheduleEventModal({
  open,
  onClose,
  setlists,
  onSubmit,
}: ScheduleEventModalProps) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("rehearsal");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("22:00");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [setlistId, setSetlistId] = useState("");
  const [titleError, setTitleError] = useState("");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    if (!open) return;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setTitle("");
    setType("rehearsal");
    setDate(tomorrow.toISOString().slice(0, 10));
    setStartTime("19:00");
    setEndTime("22:00");
    setLocation("");
    setNotes("");
    setSetlistId("");
    setTitleError("");
    setDateError("");
  }, [open]);

  const handleSubmit = () => {
    let valid = true;
    if (!title.trim()) {
      setTitleError("Title is required");
      valid = false;
    }
    if (!date) {
      setDateError("Date is required");
      valid = false;
    }
    if (!valid) return;

    const start = toIsoDateTime(date, startTime);
    const end = toIsoDateTime(date, endTime);

    if (new Date(end) <= new Date(start)) {
      setDateError("End time must be after start time");
      return;
    }

    onSubmit({
      title: title.trim(),
      type,
      start,
      end,
      location: location.trim(),
      notes: notes.trim(),
      setlistId: setlistId || undefined,
    });
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Schedule event"
      description="Rehearsal, gig, or meeting — set the when and where."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Schedule event</Button>
        </>
      }
    >
      <div className="space-y-5">
        <FormSection title="Event">
          <FormField label="Title" htmlFor="event-title" error={titleError}>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
              }}
              placeholder="e.g. Friday rehearsal"
              autoFocus
            />
          </FormField>

          <FormField label="Type">
            <div className="grid grid-cols-3 gap-2">
              {EVENT_TYPES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs font-medium transition-all",
                    type === value
                      ? eventTypePickerStyles[value]
                      : "border-border bg-surface-2 text-muted hover:border-border-subtle hover:text-foreground",
                  )}
                >
                  {eventTypeLabels[value]}
                </button>
              ))}
            </div>
          </FormField>
        </FormSection>

        <FormSection
          title="When"
          description="Date and time block for the calendar."
        >
          <FormField label="Date" htmlFor="event-date" error={dateError}>
            <div className="relative">
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <Input
                id="event-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (dateError) setDateError("");
                }}
                className="pl-9"
              />
            </div>
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Start" htmlFor="event-start">
              <Input
                id="event-start"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </FormField>
            <FormField label="End" htmlFor="event-end">
              <Input
                id="event-end"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Extras" description="All optional.">
          <FormField label="Location" htmlFor="event-location">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
              <Input
                id="event-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Studio, venue, or address"
                className="pl-9"
              />
            </div>
          </FormField>

          <FormField label="Linked setlist" htmlFor="event-setlist">
            <NativeSelect
              id="event-setlist"
              value={setlistId}
              onChange={(e) => setSetlistId(e.target.value)}
            >
              <option value="">None</option>
              {setlists.map((setlist) => (
                <option key={setlist.id} value={setlist.id}>
                  {setlist.name}
                </option>
              ))}
            </NativeSelect>
          </FormField>

          <FormField label="Notes" htmlFor="event-notes">
            <Textarea
              id="event-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What to bring, parking, dress code..."
              rows={2}
              className="min-h-[56px] resize-y"
            />
          </FormField>
        </FormSection>
      </div>
    </ModalDialog>
  );
}
