import { ModalDialog } from "@/components/ui/ModalDialog";
import { Button } from "@/components/ui/Button";
import { SongQuickStats } from "@/components/shared/SongQuickStats";
import { SearchInput } from "@/components/ui/SearchInput";
import { filterSongsByTitle } from "@/lib/song-utils";
import { statusCardHoverClass } from "@/lib/song-status";
import { cn } from "@/lib/cn";
import type { Song } from "@/types";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

export interface AddSongToSetlistModalProps {
  open: boolean;
  onClose: () => void;
  availableSongs: Song[];
  onAdd: (songId: string) => void;
}

export function AddSongToSetlistModal({
  open,
  onClose,
  availableSongs,
  onAdd,
}: AddSongToSetlistModalProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => filterSongsByTitle(availableSongs, search),
    [availableSongs, search],
  );

  const handleAdd = (songId: string) => {
    onAdd(songId);
    setSearch("");
  };

  const handleClose = () => {
    setSearch("");
    onClose();
  };

  return (
    <ModalDialog
      open={open}
      onClose={handleClose}
      title="Add song to setlist"
      description="Pick from your band library. Already-added songs are hidden."
      className="max-w-md"
      footer={
        <Button variant="secondary" onClick={handleClose}>
          Done
        </Button>
      }
    >
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search songs..."
        aria-label="Search available songs"
        containerClassName="mb-3"
      />

      <ul className="max-h-64 space-y-1 overflow-y-auto overscroll-y-contain">
        {filtered.length === 0 ? (
          <li className="py-8 text-center text-sm text-muted">
            {availableSongs.length === 0
              ? "All songs are already in this setlist."
              : "No songs match your search."}
          </li>
        ) : (
          filtered.map((song) => (
            <li key={song.id}>
              <button
                type="button"
                onClick={() => handleAdd(song.id)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-md border border-border bg-surface-1 px-3 py-2.5 text-left transition-colors",
                  statusCardHoverClass(song.status),
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {song.title}
                  </p>
                  <SongQuickStats song={song} className="mt-1" />
                </div>
                <Plus className="h-4 w-4 shrink-0 text-accent-muted" />
              </button>
            </li>
          ))
        )}
      </ul>
    </ModalDialog>
  );
}
