import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { FilterBar } from "@/components/shared/FilterBar";
import { KanbanBoard } from "@/components/shared/KanbanBoard";
import { PageHeader } from "@/components/shared/PageHeader";
import { SongCard } from "@/components/shared/SongCard";
import { ViewToggle } from "@/components/shared/ViewToggle";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SongStatusFilters } from "@/features/songs/components/SongStatusFilters";
import { formatBpm, formatDuration, formatRelativeDate } from "@/lib/format";
import { statusRowHoverClass } from "@/lib/song-status";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import type { Song, SongStatus } from "@/types";
import { SongFormModal } from "@/features/songs/components/SongFormModal";
import { useActionSearchParam } from "@/hooks/useActionSearchParam";
import { formValuesToSongPayload } from "@/lib/song-form";
import { filterSongsByTitle } from "@/lib/song-utils";
import { useToast } from "@/providers/ToastProvider";
import { LayoutGrid, Plus, Table2, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type SongsView = "table" | "kanban";

export function SongsPage() {
  const { songs, addSong, deleteSong } = useBandWorkspace();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SongStatus | "all">("all");
  const [view, setView] = useState<SongsView>("table");
  const [addOpen, setAddOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);

  useActionSearchParam("add", setAddOpen);

  const filteredSongs = useMemo(() => {
    const byTitle = filterSongsByTitle(songs, search);
    return byTitle.filter(
      (song) => statusFilter === "all" || song.status === statusFilter,
    );
  }, [songs, search, statusFilter]);

  const columns = useMemo(
    () => [
      {
        key: "title",
        header: "Title",
        cell: (song: Song) => (
          <span className="font-semibold text-foreground">{song.title}</span>
        ),
      },
      {
        key: "bpm",
        header: "BPM",
        cell: (song: Song) => (
          <span className="font-mono text-muted">{formatBpm(song.bpm)}</span>
        ),
        className: "w-24",
      },
      {
        key: "duration",
        header: "Length",
        cell: (song: Song) => (
          <span className="font-mono text-muted">
            {formatDuration(song.durationSeconds)}
          </span>
        ),
        className: "w-24",
      },
      {
        key: "status",
        header: "Status",
        cell: (song: Song) => <StatusBadge status={song.status} />,
        className: "w-40",
      },
      {
        key: "updated",
        header: "Updated",
        cell: (song: Song) => (
          <span className="text-muted">{formatRelativeDate(song.updatedAt)}</span>
        ),
        className: "w-36",
      },
      {
        key: "actions",
        header: "",
        cell: (song: Song) => (
          <div className="flex justify-end gap-1">
            <IconButton
              tone="danger"
              label={`Delete ${song.title}`}
              onClick={(e) => {
                e.stopPropagation();
                setSongToDelete(song);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ),
        className: "w-16",
      },
    ],
    [deleteSong],
  );

  return (
    <div>
      <PageHeader
        description="Track preparation status, tabs, and lyrics for your repertoire."
        actions={
          <>
            <ViewToggle
              value={view}
              onChange={setView}
              options={[
                { value: "table", label: "Table", icon: Table2 },
                { value: "kanban", label: "Board", icon: LayoutGrid },
              ]}
            />
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add song
            </Button>
          </>
        }
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search songs..."
      >
        <SongStatusFilters active={statusFilter} onChange={setStatusFilter} />
      </FilterBar>

      {view === "table" ? (
        <>
          <div className="hidden md:block">
            <DataTable
              columns={columns}
              data={filteredSongs}
              keyExtractor={(song) => song.id}
              onRowClick={(song) => navigate(`/songs/${song.id}`)}
              getRowHoverClass={(song) => statusRowHoverClass(song.status)}
              emptyMessage="No songs match your filters."
            />
          </div>
          <div className="flex flex-col gap-3 px-6 py-5 md:hidden">
            {filteredSongs.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                No songs match your filters.
              </p>
            ) : (
              filteredSongs.map((song) => (
                <SongCard
                  key={song.id}
                  song={song}
                  onClick={() => navigate(`/songs/${song.id}`)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <KanbanBoard
          songs={filteredSongs}
          onSongClick={(song) => navigate(`/songs/${song.id}`)}
        />
      )}

      <SongFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        mode="add"
        onSubmit={(values) => {
          const song = addSong(formValuesToSongPayload(values));
          setAddOpen(false);
          toast(`"${song.title}" added to library`);
          navigate(`/songs/${song.id}`);
        }}
      />

      <ConfirmDeleteModal
        open={songToDelete !== null}
        onClose={() => setSongToDelete(null)}
        onConfirm={() => {
          if (songToDelete) deleteSong(songToDelete.id);
        }}
        itemType="song"
        itemName={songToDelete?.title ?? ""}
      />
    </div>
  );
}
