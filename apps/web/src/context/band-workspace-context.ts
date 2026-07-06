import type {
  BandEvent,
  BandWorkspace,
  Setlist,
  Song,
} from "@/types";
import { createContext } from "react";

export interface BandWorkspaceContextValue extends BandWorkspace {
  isLoading: boolean;
  error: string | null;
  reloadWorkspace: () => Promise<void>;
  getSong: (id: string) => Song | undefined;
  getSetlist: (id: string) => Setlist | undefined;
  getEvent: (id: string) => BandEvent | undefined;
  updateBandName: (name: string) => void | Promise<void>;
  reorderSetlistSongs: (setlistId: string, fromIndex: number, toIndex: number) => void;
  duplicateSetlist: (setlistId: string) => void;
  deleteSetlist: (setlistId: string) => void;
  deleteSong: (songId: string) => void;
  removeSongFromSetlist: (setlistId: string, songId: string) => void;
  addSongToSetlist: (setlistId: string, songId: string) => void;
  addSong: (
    song: Omit<Song, "id" | "bandId" | "createdAt" | "updatedAt">,
  ) => Song | Promise<Song>;
  updateSong: (
    songId: string,
    patch: Partial<
      Omit<Song, "id" | "bandId" | "createdAt" | "updatedAt">
    >,
  ) => void;
  createSetlist: (
    data: Omit<Setlist, "id" | "bandId" | "songIds" | "createdAt" | "updatedAt">,
  ) => Setlist | Promise<Setlist>;
  addEvent: (event: Omit<BandEvent, "id" | "bandId">) => BandEvent | Promise<BandEvent>;
  updateEvent: (
    eventId: string,
    patch: Partial<Omit<BandEvent, "id" | "bandId">>,
  ) => Promise<void>;
  deleteEvent: (eventId: string) => void;
}

export const BandWorkspaceContext =
  createContext<BandWorkspaceContextValue | null>(null);
