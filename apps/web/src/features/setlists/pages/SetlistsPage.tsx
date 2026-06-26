import { ConfirmDeleteModal } from "@/components/shared/ConfirmDeleteModal";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/Button";
import { DataTable } from "@/components/ui/DataTable";
import { IconButton } from "@/components/ui/IconButton";
import { formatDuration, formatRelativeDate, sumDuration } from "@/lib/format";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import type { Setlist, Song } from "@/types";
import { CreateSetlistModal } from "@/features/setlists/components/CreateSetlistModal";
import { useToast } from "@/providers/ToastProvider";
import { Copy, Plus, Trash2 } from "lucide-react";
import { useActionSearchParam } from "@/hooks/useActionSearchParam";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function SetlistsPage() {
  const { setlists, getSong, duplicateSetlist, deleteSetlist, createSetlist } =
    useBandWorkspace();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [createOpen, setCreateOpen] = useState(false);
  const [setlistToDelete, setSetlistToDelete] = useState<Setlist | null>(null);

  useActionSearchParam("create", setCreateOpen);

  const columns = useMemo(
    () => [
      {
        key: "name",
        header: "Name",
        cell: (setlist: Setlist) => (
          <div>
            <p className="font-semibold text-foreground">{setlist.name}</p>
            {setlist.description && (
              <p className="mt-0.5 text-xs text-subtle">{setlist.description}</p>
            )}
          </div>
        ),
      },
      {
        key: "songs",
        header: "Songs",
        cell: (setlist: Setlist) => (
          <span className="text-muted">{setlist.songIds.length}</span>
        ),
        className: "w-20",
      },
      {
        key: "duration",
        header: "Length",
        cell: (setlist: Setlist) => {
          const songs = setlist.songIds
            .map((id) => getSong(id))
            .filter((song): song is Song => song !== undefined);
          return (
            <span className="font-mono text-muted">
              {formatDuration(sumDuration(songs))}
            </span>
          );
        },
        className: "w-24",
      },
      {
        key: "updated",
        header: "Updated",
        cell: (setlist: Setlist) => (
          <span className="text-muted">
            {formatRelativeDate(setlist.updatedAt)}
          </span>
        ),
        className: "w-36",
      },
      {
        key: "actions",
        header: "",
        cell: (setlist: Setlist) => (
          <div className="flex justify-end gap-1">
            <IconButton
              label={`Duplicate ${setlist.name}`}
              onClick={(e) => {
                e.stopPropagation();
                duplicateSetlist(setlist.id);
              }}
            >
              <Copy className="h-4 w-4" />
            </IconButton>
            <IconButton
              tone="danger"
              label={`Delete ${setlist.name}`}
              onClick={(e) => {
                e.stopPropagation();
                setSetlistToDelete(setlist);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </div>
        ),
        className: "w-28",
      },
    ],
    [duplicateSetlist, deleteSetlist, getSong],
  );

  return (
    <div>
      <PageHeader
        description="Ordered song lists for gigs, rehearsals, and experiments."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Create setlist
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={setlists}
        keyExtractor={(setlist) => setlist.id}
        onRowClick={(setlist) => navigate(`/setlists/${setlist.id}`)}
        emptyMessage="No setlists yet. Create one to get started."
      />

      <CreateSetlistModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          setCreateOpen(false);
          void Promise.resolve(createSetlist(data))
            .then((setlist) => {
              toast(`"${setlist.name}" created`);
              navigate(`/setlists/${setlist.id}`);
            })
            .catch(() => {
              toast("Could not create setlist");
            });
        }}
      />

      <ConfirmDeleteModal
        open={setlistToDelete !== null}
        onClose={() => setSetlistToDelete(null)}
        onConfirm={() => {
          if (setlistToDelete) deleteSetlist(setlistToDelete.id);
        }}
        itemType="setlist"
        itemName={setlistToDelete?.name ?? ""}
      />
    </div>
  );
}
