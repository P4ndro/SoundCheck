import type { EventType } from "@/types";

export const eventTypeLabels: Record<EventType, string> = {
  rehearsal: "Rehearsal",
  gig: "Gig",
  meeting: "Meeting",
};

export const eventTypeChipStyles: Record<EventType, string> = {
  rehearsal:
    "bg-violet-500/30 text-violet-100 border-l-2 border-l-violet-300",
  gig: "bg-emerald-500/20 text-emerald-200 border-l-2 border-l-emerald-400",
  meeting: "bg-zinc-500/20 text-zinc-300 border-l-2 border-l-zinc-400",
};

export const eventTypeCardStyles: Record<EventType, string> = {
  rehearsal:
    "border-violet-400/45 bg-violet-500/14 hover:border-violet-300/60 hover:bg-violet-500/20",
  gig: "border-emerald-500/30 bg-emerald-500/8 hover:border-emerald-400/50 hover:bg-emerald-500/12",
  meeting:
    "border-border bg-surface-1 hover:border-accent/30 hover:bg-surface-2",
};

export const eventTypeBadgeStyles: Record<EventType, string> = {
  rehearsal: "bg-violet-500/30 text-violet-200",
  gig: "bg-emerald-500/20 text-emerald-300",
  meeting: "bg-status-neutral/20 text-muted",
};

export const eventTypePickerStyles: Record<EventType, string> = {
  rehearsal:
    "border-violet-400/50 bg-violet-500/20 text-violet-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
  gig: "border-emerald-500/45 bg-emerald-500/15 text-emerald-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
  meeting:
    "border-sky-500/35 bg-sky-500/10 text-sky-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
};

export const EVENT_TYPES: EventType[] = ["rehearsal", "gig", "meeting"];

/** @deprecated use eventTypeChipStyles */
export const eventTypeColors = eventTypeChipStyles;
