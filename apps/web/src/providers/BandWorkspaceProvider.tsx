import {
  BandWorkspaceContext,
  type BandWorkspaceContextValue,
} from "@/context/band-workspace-context";
import { createId } from "@/lib/create-id";
import { runWorkspaceMutation } from "@/lib/workspace-mutation";
import { initialWorkspace } from "@/mocks/data";
import type {
  BandEvent,
  BandWorkspace,
  ChatMessage,
  Setlist,
  Song,
} from "@/types";
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export function BandWorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<BandWorkspace>(initialWorkspace);

  const getSong = useCallback(
    (id: string) => workspace.songs.find((song) => song.id === id),
    [workspace.songs],
  );

  const getSetlist = useCallback(
    (id: string) => workspace.setlists.find((setlist) => setlist.id === id),
    [workspace.setlists],
  );

  const getEvent = useCallback(
    (id: string) => workspace.events.find((event) => event.id === id),
    [workspace.events],
  );

  const updateBandName = useCallback((name: string) => {
    setWorkspace((prev) => ({
      ...prev,
      band: { ...prev.band, name },
    }));
  }, []);

  const reorderSetlistSongs = useCallback(
    (setlistId: string, fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      setWorkspace((prev) => ({
        ...prev,
        setlists: prev.setlists.map((setlist) => {
          if (setlist.id !== setlistId) return setlist;

          const songIds = [...setlist.songIds];
          const [moved] = songIds.splice(fromIndex, 1);
          if (!moved) return setlist;
          songIds.splice(toIndex, 0, moved);

          return {
            ...setlist,
            songIds,
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [],
  );

  const duplicateSetlist = useCallback((setlistId: string) => {
    setWorkspace((prev) => {
      const source = prev.setlists.find((s) => s.id === setlistId);
      if (!source) return prev;

      const copy: Setlist = {
        ...source,
        id: createId("setlist"),
        name: `${source.name} (copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return { ...prev, setlists: [...prev.setlists, copy] };
    });
  }, []);

  const deleteSetlist = useCallback((setlistId: string) => {
    setWorkspace((prev) => ({
      ...prev,
      setlists: prev.setlists.filter((s) => s.id !== setlistId),
    }));
  }, []);

  const removeSongFromSetlist = useCallback(
    (setlistId: string, songId: string) => {
      setWorkspace((prev) => ({
        ...prev,
        setlists: prev.setlists.map((setlist) => {
          if (setlist.id !== setlistId) return setlist;
          return {
            ...setlist,
            songIds: setlist.songIds.filter((id) => id !== songId),
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [],
  );

  const addSongToSetlist = useCallback(
    (setlistId: string, songId: string) => {
      setWorkspace((prev) => ({
        ...prev,
        setlists: prev.setlists.map((setlist) => {
          if (setlist.id !== setlistId) return setlist;
          if (setlist.songIds.includes(songId)) return setlist;
          return {
            ...setlist,
            songIds: [...setlist.songIds, songId],
            updatedAt: new Date().toISOString(),
          };
        }),
      }));
    },
    [],
  );

  const addSong = useCallback(
    (
      data: Omit<Song, "id" | "bandId" | "createdAt" | "updatedAt">,
    ): Song =>
      runWorkspaceMutation(setWorkspace, (prev) => {
        const now = new Date().toISOString();
        const song: Song = {
          ...data,
          id: createId("song"),
          bandId: prev.band.id,
          createdAt: now,
          updatedAt: now,
        };
        return {
          workspace: { ...prev, songs: [...prev.songs, song] },
          result: song,
        };
      }),
    [],
  );

  const updateSong = useCallback(
    (
      songId: string,
      patch: Partial<
        Omit<Song, "id" | "bandId" | "createdAt" | "updatedAt">
      >,
    ) => {
      setWorkspace((prev) => ({
        ...prev,
        songs: prev.songs.map((song) =>
          song.id === songId
            ? { ...song, ...patch, updatedAt: new Date().toISOString() }
            : song,
        ),
      }));
    },
    [],
  );

  const createSetlist = useCallback(
    (
      data: Omit<
        Setlist,
        "id" | "bandId" | "songIds" | "createdAt" | "updatedAt"
      >,
    ): Setlist =>
      runWorkspaceMutation(setWorkspace, (prev) => {
        const now = new Date().toISOString();
        const setlist: Setlist = {
          ...data,
          id: createId("setlist"),
          bandId: prev.band.id,
          songIds: [],
          createdAt: now,
          updatedAt: now,
        };
        return {
          workspace: { ...prev, setlists: [...prev.setlists, setlist] },
          result: setlist,
        };
      }),
    [],
  );

  const addEvent = useCallback(
    (event: Omit<BandEvent, "id" | "bandId">): BandEvent =>
      runWorkspaceMutation(setWorkspace, (prev) => {
        const newEvent: BandEvent = {
          ...event,
          id: createId("event"),
          bandId: prev.band.id,
        };
        return {
          workspace: { ...prev, events: [...prev.events, newEvent] },
          result: newEvent,
        };
      }),
    [],
  );

  const sendChatMessage = useCallback(
    (payload: {
      text?: string;
      imageUrl?: string;
      imageCaption?: string;
    }): ChatMessage =>
      runWorkspaceMutation(setWorkspace, (prev) => {
        const hasImage = Boolean(payload.imageUrl);
        const message: ChatMessage = {
          id: createId("msg"),
          bandId: prev.band.id,
          senderId: prev.currentUser.id,
          type: hasImage ? "image" : "text",
          text: hasImage ? undefined : payload.text?.trim(),
          imageUrl: payload.imageUrl,
          imageCaption: hasImage
            ? payload.imageCaption?.trim() || payload.text?.trim()
            : undefined,
          createdAt: new Date().toISOString(),
        };
        return {
          workspace: {
            ...prev,
            chatMessages: [...prev.chatMessages, message],
          },
          result: message,
        };
      }),
    [],
  );

  const value = useMemo<BandWorkspaceContextValue>(
    () => ({
      ...workspace,
      getSong,
      getSetlist,
      getEvent,
      updateBandName,
      reorderSetlistSongs,
      duplicateSetlist,
      deleteSetlist,
      removeSongFromSetlist,
      addSongToSetlist,
      addSong,
      updateSong,
      createSetlist,
      addEvent,
      sendChatMessage,
    }),
    [
      workspace,
      getSong,
      getSetlist,
      getEvent,
      updateBandName,
      reorderSetlistSongs,
      duplicateSetlist,
      deleteSetlist,
      removeSongFromSetlist,
      addSongToSetlist,
      addSong,
      updateSong,
      createSetlist,
      addEvent,
      sendChatMessage,
    ],
  );

  return (
    <BandWorkspaceContext.Provider value={value}>
      {children}
    </BandWorkspaceContext.Provider>
  );
}
