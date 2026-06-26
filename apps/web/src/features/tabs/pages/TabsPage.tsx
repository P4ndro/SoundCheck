import { NotationMetaBar } from "@/components/shared/NotationMetaBar";
import { PageHeader } from "@/components/shared/PageHeader";
import { TabContentViewer } from "@/features/songs/components/TabContentViewer";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/providers/ToastProvider";
import { formatBpm, formatDuration } from "@/lib/format";
import { tabCapoForDisplay } from "@/lib/tab-display";
import { roleLabels, roleToInstrument } from "@/lib/roles";
import { songStatusStyles } from "@/lib/song-status";
import { cn } from "@/lib/cn";
import {
  useBandWorkspace,
  useCurrentMemberRole,
} from "@/hooks/useBandWorkspace";
import type { Instrument, Song } from "@/types";
import {
  Drum,
  FileMusic,
  Guitar,
  Mic,
  Music2,
  PanelLeftClose,
  PanelLeftOpen,
  Pencil,
  Plus,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const instrumentIcons: Partial<Record<Instrument, LucideIcon>> = {
  bass: Music2,
  drums: Drum,
  vocals: Mic,
  lead_guitar: Guitar,
  rhythm_guitar: Guitar,
};

export function TabsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { songs, tabs } = useBandWorkspace();
  const memberRole = useCurrentMemberRole();
  const defaultInstrument = roleToInstrument(memberRole ?? "bass") ?? "bass";
  const ownInstrument = roleToInstrument(memberRole ?? "custom");

  const [instrument, setInstrument] = useState<Instrument>(() => {
    const fromUrl = searchParams.get("instrument");
    if (fromUrl && fromUrl in instrumentIcons) {
      return fromUrl as Instrument;
    }
    return defaultInstrument;
  });
  const [selectedSongId, setSelectedSongId] = useState<string | null>(
    () => searchParams.get("songId"),
  );
  const [songListOpen, setSongListOpen] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fromUrl = searchParams.get("instrument");
    if (fromUrl && fromUrl in instrumentIcons) {
      setInstrument(fromUrl as Instrument);
    }
  }, [searchParams]);

  useEffect(() => {
    const fromUrl = searchParams.get("songId");
    if (fromUrl) {
      setSelectedSongId(fromUrl);
    }
  }, [searchParams]);

  const songsWithTabs = useMemo(() => {
    const songIds = new Set(
      tabs
        .filter((tab) => tab.instrument === instrument)
        .map((tab) => tab.songId),
    );
    return songs.filter((song) => songIds.has(song.id));
  }, [songs, tabs, instrument]);

  const selectedSong: Song | undefined =
    songsWithTabs.find((song) => song.id === selectedSongId) ??
    songsWithTabs[0];

  const selectedSongTabs = selectedSong
    ? tabs.filter((tab) => tab.songId === selectedSong.id)
    : [];

  const activeTab = selectedSongTabs.find(
    (tab) => tab.instrument === instrument,
  );

  const instrumentsWithTabs = useMemo(() => {
    const set = new Set<Instrument>();
    for (const tab of tabs) set.add(tab.instrument);
    return Array.from(set);
  }, [tabs]);

  const instrumentLabel = activeTab?.trackName ?? roleLabels[instrument];
  const canEditOwnPart =
    ownInstrument === instrument && Boolean(selectedSong);

  const openEditor = (songId: string) => {
    if (!ownInstrument) {
      toast("Custom roles cannot edit notation yet", "info");
      return;
    }

    navigate(`/tabs/edit?songId=${encodeURIComponent(songId)}`);
  };

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <PageHeader
        className="shrink-0"
        description="Your instrument notation — switch songs and parts quickly."
        actions={
          <div className="flex flex-wrap gap-2">
            {canEditOwnPart && activeTab && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openEditor(selectedSong!.id)}
              >
                <Pencil className="h-4 w-4" />
                Edit notation
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                openEditor(selectedSong?.id ?? songs[0]?.id ?? "")
              }
              disabled={!songs.length || !ownInstrument}
            >
              <Plus className="h-4 w-4" />
              Add notation
            </Button>
          </div>
        }
      />

      <div className="flex shrink-0 items-center gap-3 border-b border-border bg-surface-1 px-6 py-2.5">
        <span className="shrink-0 text-[11px] font-semibold tracking-wide text-subtle uppercase">
          Your part
        </span>
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-surface-2 p-1">
          {instrumentsWithTabs.map((value) => {
            const Icon = instrumentIcons[value];
            const isActive = instrument === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setInstrument(value);
                  setSelectedSongId(null);
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                  isActive
                    ? "bg-accent-subtle text-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.06)]"
                    : "text-muted hover:bg-surface-3 hover:text-foreground",
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />}
                {roleLabels[value]}
                {value === defaultInstrument && (
                  <span className="text-[10px] font-normal text-accent-muted">
                    you
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {songsWithTabs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-surface-1">
            <FileMusic className="h-5 w-5 text-subtle" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              No {roleLabels[instrument].toLowerCase()} notation yet
            </p>
            <p className="mt-1 text-sm text-muted">
              Add a part to a song in your library to see it here.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => openEditor(songs[0]?.id ?? "")}
            disabled={!songs.length || !ownInstrument}
          >
            <Plus className="h-4 w-4" />
            Add notation
          </Button>
        </div>
      ) : (
        <div className="flex h-0 min-h-0 flex-1 overflow-hidden">
          <aside
            className={cn(
              "flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-border bg-surface-1 transition-[width] duration-200",
              songListOpen ? "w-(--panel-width)" : "w-12",
            )}
          >
            <div
              className={cn(
                "flex shrink-0 items-center border-b border-border-subtle",
                songListOpen
                  ? "justify-between px-3 py-2.5"
                  : "justify-center py-2.5",
              )}
            >
              {songListOpen && (
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-semibold tracking-wide text-subtle uppercase">
                    Songs
                  </p>
                  <span className="rounded-full bg-surface-3 px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted">
                    {songsWithTabs.length}
                  </span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn(!songListOpen && "px-2")}
                onClick={() => setSongListOpen((open) => !open)}
                aria-label={songListOpen ? "Hide song list" : "Show song list"}
                title={songListOpen ? "Hide songs" : "Show songs"}
              >
                {songListOpen ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </Button>
            </div>

            {songListOpen && (
              <ul className="scroll-smooth-touch min-h-0 flex-1 space-y-0.5 overflow-y-auto overscroll-y-contain p-2 pr-1">
                {songsWithTabs.map((song) => {
                  const isActive = selectedSong?.id === song.id;
                  const statusStyle = songStatusStyles[song.status];
                  return (
                    <li key={song.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedSongId(song.id)}
                        className={cn(
                          "relative w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150",
                          isActive
                            ? "bg-accent-subtle/50 ring-1 ring-accent/25"
                            : "hover:bg-surface-2",
                        )}
                      >
                        {isActive && (
                          <span className="absolute top-2.5 bottom-2.5 left-0 w-0.5 rounded-full bg-accent" />
                        )}
                        <div className="flex items-start gap-2">
                          <span
                            className={cn(
                              "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                              statusStyle.dot,
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "truncate text-sm font-medium",
                                isActive
                                  ? "text-foreground"
                                  : "text-muted group-hover:text-foreground",
                              )}
                            >
                              {song.title}
                            </p>
                            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-subtle">
                              {song.key && (
                                <span className="rounded bg-surface-3 px-1.5 py-0.5 font-semibold text-accent-muted">
                                  {song.key}
                                </span>
                              )}
                              <span>{formatBpm(song.bpm)}</span>
                              <span className="text-border">·</span>
                              <span>{formatDuration(song.durationSeconds)}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-background">
            {selectedSong && activeTab && (
              <>
                <div className="shrink-0 space-y-4 p-4 pb-3 sm:p-6 sm:pb-4">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">
                    {selectedSong.title}
                  </h3>
                  <NotationMetaBar
                    song={selectedSong}
                    instrumentLabel={instrumentLabel}
                    capo={tabCapoForDisplay(activeTab)}
                  />
                </div>
                <div className="flex h-0 min-h-0 flex-1 flex-col overflow-hidden px-4 pb-4 sm:px-6 sm:pb-6">
                  <TabContentViewer
                    tabs={selectedSongTabs}
                    selectedInstrument={instrument}
                    showInstrumentPicker={false}
                    showZoom
                    wide
                    fillHeight
                    className="h-full min-h-0"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
