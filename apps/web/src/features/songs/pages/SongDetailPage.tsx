import { ContentPanel } from "@/components/shared/ContentPanel";
import { DetailBackLink } from "@/components/shared/DetailBackLink";
import { NotFoundPage } from "@/components/shared/NotFoundPage";
import { SongMetaStrip } from "@/components/shared/SongMetaStrip";
import { TabContentViewer } from "@/features/songs/components/TabContentViewer";
import { Button } from "@/components/ui/Button";
import { SongFormModal } from "@/features/songs/components/SongFormModal";
import { formValuesToSongPayload } from "@/lib/song-form";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { useToast } from "@/providers/ToastProvider";
import type { Instrument } from "@/types";
import { useState } from "react";
import { useParams } from "react-router-dom";

export function SongDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getSong, tabs, updateSong } = useBandWorkspace();
  const { toast } = useToast();
  const song = id ? getSong(id) : undefined;
  const [editOpen, setEditOpen] = useState(false);

  const songTabs = tabs.filter((tab) => tab.songId === song?.id);
  const [instrument, setInstrument] = useState<Instrument | undefined>(
    songTabs[0]?.instrument,
  );

  if (!song) {
    return (
      <NotFoundPage
        title="Song not found"
        description="This song doesn't exist or may have been removed."
        backHref="/songs"
        backLabel="Back to songs"
      />
    );
  }

  return (
    <div className="px-6 py-5">
      <DetailBackLink
        to="/songs"
        label="Songs"
        currentTitle={song.title}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {song.title}
          </h2>
          <div className="mt-4">
            <SongMetaStrip song={song} />
          </div>
        </div>
        <Button
          variant="secondary"
          className="shrink-0"
          onClick={() => setEditOpen(true)}
        >
          Edit song
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section>
          <TabContentViewer
            tabs={songTabs}
            selectedInstrument={instrument}
            onInstrumentChange={setInstrument}
          />
        </section>

        <div className="flex flex-col gap-6">
          <ContentPanel title="Lyrics">
            <pre className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/95">
              {song.lyrics || "No lyrics added yet."}
            </pre>
          </ContentPanel>

          <ContentPanel title="Band notes">
            <p className="text-sm leading-relaxed text-muted">
              {song.notes || "No notes added yet."}
            </p>
          </ContentPanel>
        </div>
      </div>

      <SongFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        mode="edit"
        song={song}
        onSubmit={(values) => {
          updateSong(song.id, formValuesToSongPayload(values));
          setEditOpen(false);
          toast("Song updated");
        }}
      />
    </div>
  );
}
