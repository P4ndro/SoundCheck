import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { roleLabels } from "@/lib/roles";
import type { Instrument, Song } from "@/types";

export interface AddNotationModalProps {
  open: boolean;
  onClose: () => void;
  songs: Song[];
  songId: string;
  instrument: Instrument;
  onSongIdChange: (songId: string) => void;
  onContinue: () => void;
}

export function AddNotationModal({
  open,
  onClose,
  songs,
  songId,
  instrument,
  onSongIdChange,
  onContinue,
}: AddNotationModalProps) {
  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Add notation"
      description="Attach an instrument part to a song in your library."
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onContinue}>Continue</Button>
        </>
      }
    >
      <div className="space-y-4">
        <FormField label="Song" htmlFor="notation-song">
          <NativeSelect
            id="notation-song"
            value={songId}
            onChange={(e) => onSongIdChange(e.target.value)}
          >
            {songs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.title}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField label="Instrument" htmlFor="notation-instrument">
          <NativeSelect id="notation-instrument" value={instrument} disabled>
            <option value={instrument}>{roleLabels[instrument]}</option>
          </NativeSelect>
        </FormField>

        <div className="rounded-md border border-dashed border-border bg-surface-1 px-4 py-5 text-center">
          <p className="text-sm font-medium text-foreground">
            Tab & chord editor
          </p>
          <p className="mt-1 text-xs text-muted">
            Write ASCII tabs or chord charts per instrument — coming in the
            next build.
          </p>
        </div>
      </div>
    </ModalDialog>
  );
}
