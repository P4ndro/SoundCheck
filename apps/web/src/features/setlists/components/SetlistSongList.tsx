import { IconButton } from "@/components/ui/IconButton";
import { SongQuickStats } from "@/components/shared/SongQuickStats";
import { songStatusStyles, statusCardHoverClass } from "@/lib/song-status";
import type { Song } from "@/types";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";

export interface SetlistSongListProps {
  songs: Song[];
  onReorder: (fromIndex: number, toIndex: number) => void;
  onRemove: (songId: string) => void;
}

export function SetlistSongList({
  songs,
  onReorder,
  onRemove,
}: SetlistSongListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const fromIndex = songs.findIndex((song) => song.id === active.id);
    const toIndex = songs.findIndex((song) => song.id === over.id);
    if (fromIndex === -1 || toIndex === -1) return;

    onReorder(fromIndex, toIndex);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={songs.map((song) => song.id)}
        strategy={verticalListSortingStrategy}
      >
        <ol className="space-y-2">
          {songs.map((song, index) => (
            <SortableSetlistRow
              key={song.id}
              song={song}
              index={index}
              onRemove={() => onRemove(song.id)}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

function SortableSetlistRow({
  song,
  index,
  onRemove,
}: {
  song: Song;
  index: number;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: song.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const statusStyle = songStatusStyles[song.status];

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-surface-1 transition-all duration-150",
        statusCardHoverClass(song.status),
        isDragging && cn("z-10 bg-surface-3 shadow-lg", statusStyle.filterActive),
      )}
    >
      <button
        type="button"
        className="flex h-12 w-9 shrink-0 cursor-grab items-center justify-center text-subtle transition-colors hover:text-muted active:cursor-grabbing"
        aria-label={`Reorder ${song.title}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md font-mono text-sm font-semibold",
          statusStyle.kanbanCount,
        )}
      >
        {index + 1}
      </span>

      <Link
        to={`/songs/${song.id}`}
        className={cn(
          "min-w-0 flex-1 py-3 pr-2 transition-colors",
          statusStyle.kanbanHeader,
          "hover:opacity-90",
        )}
      >
        <p className="truncate text-sm font-medium text-foreground">
          {song.title}
        </p>
        <SongQuickStats song={song} className="mt-1" />
      </Link>

      <IconButton
        tone="danger"
        label={`Remove ${song.title} from setlist`}
        onClick={onRemove}
        className="mr-2 shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </li>
  );
}
