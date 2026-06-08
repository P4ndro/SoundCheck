import { ModalDialog } from "@/components/ui/ModalDialog";
import { Button } from "@/components/ui/Button";
import { eventTypeBadgeStyles, eventTypeLabels } from "@/lib/event-type";
import { formatDateTime, formatTime } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { BandEvent } from "@/types";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export interface EventDetailModalProps {
  event: BandEvent | null;
  setlistName?: string;
  onClose: () => void;
}

export function EventDetailModal({
  event,
  setlistName,
  onClose,
}: EventDetailModalProps) {
  return (
    <ModalDialog
      open={event !== null}
      onClose={onClose}
      title={event?.title ?? ""}
      footer={<Button variant="secondary" onClick={onClose}>Close</Button>}
    >
      {event && (
        <div className="space-y-4">
          <span
            className={cn(
              "inline-flex rounded-sm border px-2 py-0.5 text-xs font-medium",
              eventTypeBadgeStyles[event.type],
            )}
          >
            {eventTypeLabels[event.type]}
          </span>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 text-muted">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p>{formatDateTime(event.start)}</p>
                <p className="text-subtle">
                  {formatTime(event.start)} – {formatTime(event.end)}
                </p>
              </div>
            </div>

            {event.location && (
              <div className="flex items-start gap-3 text-muted">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{event.location}</p>
              </div>
            )}

            {event.notes && (
              <p className="rounded-md border border-border bg-surface-1 p-3 text-muted">
                {event.notes}
              </p>
            )}

            {event.setlistId && setlistName && (
              <div>
                <p className="mb-1 text-xs text-subtle uppercase tracking-wide">
                  Linked setlist
                </p>
                <Link
                  to={`/setlists/${event.setlistId}`}
                  onClick={onClose}
                  className="text-sm font-medium text-accent-muted hover:text-accent-hover"
                >
                  {setlistName}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </ModalDialog>
  );
}
