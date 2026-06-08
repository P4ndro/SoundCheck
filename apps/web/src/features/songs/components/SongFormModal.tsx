import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { ModalDialog } from "@/components/ui/ModalDialog";
import { NativeSelect } from "@/components/ui/NativeSelect";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/cn";
import {
  emptySongForm,
  formValuesToSongPayload,
  songToFormValues,
  type SongFormValues,
} from "@/lib/song-form";
import { SONG_STATUSES, songStatusLabels } from "@/lib/song-status";
import type { Song, SongStatus } from "@/types";

export type { SongFormValues };
export { formValuesToSongPayload };
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export interface SongFormModalProps {
  open: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  song?: Song;
  onSubmit: (values: SongFormValues) => void;
}

export function SongFormModal({
  open,
  onClose,
  mode,
  song,
  onSubmit,
}: SongFormModalProps) {
  const [form, setForm] = useState<SongFormValues>(emptySongForm);
  const [titleError, setTitleError] = useState("");
  const [showExtras, setShowExtras] = useState(false);

  useEffect(() => {
    if (!open) return;
    const nextForm =
      mode === "edit" && song ? songToFormValues(song) : emptySongForm();
    setForm(nextForm);
    setTitleError("");
    setShowExtras(
      mode === "edit" && song
        ? Boolean(song.lyrics.trim() || song.notes.trim())
        : false,
    );
  }, [open, mode, song]);

  const update = <K extends keyof SongFormValues>(
    key: K,
    value: SongFormValues[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === "title" && titleError) setTitleError("");
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setTitleError("Title is required");
      return;
    }
    onSubmit(form);
  };

  const isAdd = mode === "add";

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      size="lg"
      title={isAdd ? "Add song" : "Edit song"}
      description={
        isAdd
          ? "Core details first — lyrics and band notes are optional."
          : "Update metadata, lyrics, and notes."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isAdd ? "Add song" : "Save changes"}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <FormSection title="Basics">
          <FormField label="Title" htmlFor="song-title" error={titleError}>
            <Input
              id="song-title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Midnight Drive"
              autoFocus
            />
          </FormField>

          <FormField label="Status" htmlFor="song-status">
            <NativeSelect
              id="song-status"
              value={form.status}
              onChange={(e) => update("status", e.target.value as SongStatus)}
            >
              {SONG_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {songStatusLabels[status]}
                </option>
              ))}
            </NativeSelect>
          </FormField>
        </FormSection>

        <FormSection
          title="Music info"
          description="Key, tuning, and tempo — fill in what you know."
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Key" htmlFor="song-key" hint="Optional">
              <Input
                id="song-key"
                value={form.key}
                onChange={(e) => update("key", e.target.value)}
                placeholder="Am"
                className="font-mono"
              />
            </FormField>
            <FormField label="Tuning" htmlFor="song-tuning" hint="Optional">
              <Input
                id="song-tuning"
                value={form.tuning}
                onChange={(e) => update("tuning", e.target.value)}
                placeholder="E A D G"
                className="font-mono"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="BPM" htmlFor="song-bpm" hint="Optional">
              <Input
                id="song-bpm"
                type="number"
                min={1}
                max={400}
                value={form.bpm}
                onChange={(e) => update("bpm", e.target.value)}
                placeholder="120"
                className="font-mono"
              />
            </FormField>
            <FormField label="Time signature" htmlFor="song-time-sig">
              <Input
                id="song-time-sig"
                value={form.timeSignature}
                onChange={(e) => update("timeSignature", e.target.value)}
                placeholder="4/4"
                className="font-mono"
              />
            </FormField>
          </div>

          <FormField label="Length">
            <div className="flex max-w-[220px] items-center gap-2">
              <Input
                type="number"
                min={0}
                value={form.durationMinutes}
                onChange={(e) => update("durationMinutes", e.target.value)}
                aria-label="Minutes"
                className="font-mono"
              />
              <span className="text-xs text-subtle">min</span>
              <Input
                type="number"
                min={0}
                max={59}
                value={form.durationSeconds}
                onChange={(e) => update("durationSeconds", e.target.value)}
                aria-label="Seconds"
                className="font-mono"
              />
              <span className="text-xs text-subtle">sec</span>
            </div>
          </FormField>
        </FormSection>

        <div className="rounded-lg border border-border/80 bg-surface-1/40">
          <button
            type="button"
            onClick={() => setShowExtras((open) => !open)}
            className="flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left transition-colors hover:bg-surface-1/60"
          >
            <div>
              <p className="text-sm font-medium text-foreground">
                Lyrics & band notes
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Optional — expand when you need them
              </p>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-subtle transition-transform duration-200",
                showExtras && "rotate-180",
              )}
            />
          </button>

          {showExtras && (
            <div className="space-y-3.5 border-t border-border/70 px-3.5 pb-3.5 pt-3">
              <FormField label="Lyrics" htmlFor="song-lyrics">
                <Textarea
                  id="song-lyrics"
                  value={form.lyrics}
                  onChange={(e) => update("lyrics", e.target.value)}
                  placeholder="Verse, chorus, bridge..."
                  rows={3}
                  className="min-h-[72px] resize-y"
                />
              </FormField>
              <FormField label="Band notes" htmlFor="song-notes">
                <Textarea
                  id="song-notes"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Arrangement ideas, cues, who leads..."
                  rows={2}
                  className="min-h-[56px] resize-y"
                />
              </FormField>
            </div>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}

