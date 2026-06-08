import { DetailBackLink } from "@/components/shared/DetailBackLink";
import { NotFoundPage } from "@/components/shared/NotFoundPage";
import { AddSongToSetlistModal } from "@/features/setlists/components/AddSongToSetlistModal";
import { SetlistSongList } from "@/features/setlists/components/SetlistSongList";
import { Button } from "@/components/ui/Button";
import { eventTypeLabels } from "@/lib/event-type";
import { formatDateTime, formatDuration, sumDuration } from "@/lib/format";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import {
  resolveSetlistSongs,
  songsNotInSetlist,
} from "@/lib/song-utils";
import { Calendar, Copy, Clock, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

export function SetlistDetailPage() {
  const {
    songs: allSongs,
    getSetlist,
    getSong,
    events,
    duplicateSetlist,
    reorderSetlistSongs,
    removeSongFromSetlist,
    addSongToSetlist,
  } = useBandWorkspace();
  const { id } = useParams<{ id: string }>();
  const [addSongOpen, setAddSongOpen] = useState(false);
  const setlist = id ? getSetlist(id) : undefined;

  const availableSongs = useMemo(
    () => (setlist ? songsNotInSetlist(allSongs, setlist) : []),
    [allSongs, setlist],
  );

  if (!setlist) {
    return (
      <NotFoundPage
        title="Setlist not found"
        description="This setlist doesn't exist or may have been removed."
        backHref="/setlists"
        backLabel="Back to setlists"
      />
    );
  }

  const songs = resolveSetlistSongs(setlist, getSong);

  const totalSeconds = sumDuration(songs);
  const linkedEvent = events.find((event) => event.setlistId === setlist.id);

  return (
    <div className="px-6 py-5">
      <DetailBackLink to="/setlists" label="Back to setlists" />

      {linkedEvent && (
        <div className="mb-5 flex items-center gap-3 rounded-lg border border-accent/25 bg-accent-subtle px-4 py-3">
          <Calendar className="h-4 w-4 shrink-0 text-accent-muted" />
          <div className="min-w-0 text-sm">
            <p className="font-medium text-foreground">
              Linked to {linkedEvent.title}
            </p>
            <p className="text-muted">
              {eventTypeLabels[linkedEvent.type]} ·{" "}
              {formatDateTime(linkedEvent.start)}
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            {setlist.name}
          </h2>
          {setlist.description && (
            <p className="mt-2 text-sm text-muted">{setlist.description}</p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted">
              <Clock className="h-4 w-4 text-accent-muted" />
              <span className="font-mono font-medium text-foreground">
                {formatDuration(totalSeconds)}
              </span>
              <span className="text-subtle">total</span>
            </span>
            <span className="text-subtle">
              {songs.length} {songs.length === 1 ? "song" : "songs"}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button onClick={() => setAddSongOpen(true)}>
            <Plus className="h-4 w-4" />
            Add song
          </Button>
          <Button
            variant="secondary"
            onClick={() => duplicateSetlist(setlist.id)}
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs font-medium tracking-wide text-subtle uppercase">
          Drag to reorder
        </p>
        {songs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-12 text-center">
            <p className="text-sm text-muted">No songs in this setlist yet.</p>
            <Button className="mt-4" onClick={() => setAddSongOpen(true)}>
              <Plus className="h-4 w-4" />
              Add first song
            </Button>
          </div>
        ) : (
          <SetlistSongList
            songs={songs}
            onReorder={(from, to) =>
              reorderSetlistSongs(setlist.id, from, to)
            }
            onRemove={(songId) => removeSongFromSetlist(setlist.id, songId)}
          />
        )}
      </div>

      <AddSongToSetlistModal
        open={addSongOpen}
        onClose={() => setAddSongOpen(false)}
        availableSongs={availableSongs}
        onAdd={(songId) => addSongToSetlist(setlist.id, songId)}
      />
    </div>
  );
}
