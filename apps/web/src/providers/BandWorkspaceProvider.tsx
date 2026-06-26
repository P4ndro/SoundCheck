import {
  BandWorkspaceContext,
  type BandWorkspaceContextValue,
} from "@/context/band-workspace-context";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useSession } from "@/hooks/useSession";
import { useWorkspaceQuery } from "@/hooks/useWorkspaceQuery";
import { createId } from "@/lib/create-id";
import { queryKeys } from "@/lib/query-keys";
import { initialWorkspace } from "@/mocks/data";
import {
  runWorkspaceMutation,
  type PatchWorkspace,
} from "@/lib/workspace-mutation";
import {
  addSongToSetlistRequest,
  createEventRequest,
  createSetlistRequest,
  createSongRequest,
  deleteSetlistRequest,
  deleteSongRequest,
  duplicateSetlistRequest,
  removeSongFromSetlistRequest,
  reorderSetlistRequest,
  updateSongRequest,
} from "@/services/api-client";
import type {
  BandEvent,
  BandWorkspace,
  Setlist,
  Song,
} from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";

export function BandWorkspaceProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  const { session } = useSession();
  const { activeBand } = useActiveBand();
  const queryClient = useQueryClient();
  const bandId = activeBand?.id;

  const workspaceQuery = useWorkspaceQuery(bandId);
  const workspace = workspaceQuery.data ?? initialWorkspace;

  const isWorkspaceStale = Boolean(
    bandId && workspaceQuery.data && workspaceQuery.data.band.id !== bandId,
  );

  const noBand =
    Boolean(isSignedIn) &&
    session?.onboarding.nextStep === "complete" &&
    !bandId;

  const isLoading =
    isWorkspaceStale ||
    (workspaceQuery.isPending && workspaceQuery.data === undefined);

  const error = noBand
    ? "No band found for this account"
    : workspaceQuery.error instanceof Error
      ? workspaceQuery.error.message
      : workspaceQuery.error
        ? "Failed to load workspace"
        : null;

  const patchWorkspace = useCallback<PatchWorkspace>(
    (updater) => {
      if (!bandId) return;
      queryClient.setQueryData<BandWorkspace>(
        queryKeys.workspace(bandId),
        (old) => updater(old ?? initialWorkspace),
      );
    },
    [bandId, queryClient],
  );

  const reloadWorkspace = useCallback(async () => {
    if (!bandId) return;
    await queryClient.invalidateQueries({
      queryKey: queryKeys.workspace(bandId),
    });
  }, [bandId, queryClient]);

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

  const updateBandName = useCallback(
    (name: string) => {
      patchWorkspace((prev) => ({
        ...prev,
        band: { ...prev.band, name },
      }));
    },
    [patchWorkspace],
  );

  const workspaceBandId = workspace.band.id;

  const replaceSetlist = useCallback(
    (setlist: Setlist) => {
      patchWorkspace((prev) => ({
        ...prev,
        setlists: prev.setlists.map((item) =>
          item.id === setlist.id ? setlist : item,
        ),
      }));
    },
    [patchWorkspace],
  );

  const reorderSetlistSongs = useCallback(
    (setlistId: string, fromIndex: number, toIndex: number) => {
      if (fromIndex === toIndex) return;

      const current = workspace.setlists.find(
        (setlist) => setlist.id === setlistId,
      );
      if (!current) return;

      const songIds = [...current.songIds];
      const [moved] = songIds.splice(fromIndex, 1);
      if (!moved) return;
      songIds.splice(toIndex, 0, moved);

      patchWorkspace((prev) => ({
        ...prev,
        setlists: prev.setlists.map((setlist) =>
          setlist.id === setlistId
            ? {
                ...setlist,
                songIds,
                updatedAt: new Date().toISOString(),
              }
            : setlist,
        ),
      }));

      if (!isSignedIn || !bandId) return;

      void reorderSetlistRequest(bandId, setlistId, songIds, getToken)
        .then(({ setlist }) => {
          replaceSetlist(setlist);
        })
        .catch(() => {
          void reloadWorkspace();
        });
    },
    [
      bandId,
      getToken,
      isSignedIn,
      patchWorkspace,
      reloadWorkspace,
      replaceSetlist,
      workspace.setlists,
    ],
  );

  const duplicateSetlist = useCallback(
    (setlistId: string) => {
      if (!isSignedIn) {
        patchWorkspace((prev) => {
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
        return;
      }

      if (!bandId) return;

      void duplicateSetlistRequest(bandId, setlistId, getToken)
        .then(({ setlist }) => {
          patchWorkspace((prev) => ({
            ...prev,
            setlists: [...prev.setlists, setlist],
          }));
        })
        .catch(() => {
          void reloadWorkspace();
        });
    },
    [bandId, getToken, isSignedIn, patchWorkspace, reloadWorkspace],
  );

  const deleteSetlist = useCallback(
    (setlistId: string) => {
      patchWorkspace((prev) => ({
        ...prev,
        setlists: prev.setlists.filter((s) => s.id !== setlistId),
      }));

      if (!isSignedIn || !bandId) return;

      void deleteSetlistRequest(bandId, setlistId, getToken).catch(() => {
        void reloadWorkspace();
      });
    },
    [bandId, getToken, isSignedIn, patchWorkspace, reloadWorkspace],
  );

  const deleteSong = useCallback(
    (songId: string) => {
      patchWorkspace((prev) => ({
        ...prev,
        songs: prev.songs.filter((s) => s.id !== songId),
        tabs: prev.tabs.filter((tab) => tab.songId !== songId),
        setlists: prev.setlists.map((setlist) => ({
          ...setlist,
          songIds: setlist.songIds.filter((id) => id !== songId),
        })),
      }));

      if (!isSignedIn || !bandId) return;

      void deleteSongRequest(bandId, songId, getToken).catch(() => {
        void reloadWorkspace();
      });
    },
    [bandId, getToken, isSignedIn, patchWorkspace, reloadWorkspace],
  );

  const removeSongFromSetlist = useCallback(
    (setlistId: string, songId: string) => {
      patchWorkspace((prev) => ({
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

      if (!isSignedIn || !bandId) return;

      void removeSongFromSetlistRequest(bandId, setlistId, songId, getToken)
        .then(({ setlist }) => {
          replaceSetlist(setlist);
        })
        .catch(() => {
          void reloadWorkspace();
        });
    },
    [bandId, getToken, isSignedIn, patchWorkspace, reloadWorkspace, replaceSetlist],
  );

  const addSongToSetlist = useCallback(
    (setlistId: string, songId: string) => {
      patchWorkspace((prev) => ({
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

      if (!isSignedIn || !bandId) return;

      void addSongToSetlistRequest(bandId, setlistId, songId, getToken)
        .then(({ setlist }) => {
          replaceSetlist(setlist);
        })
        .catch(() => {
          void reloadWorkspace();
        });
    },
    [bandId, getToken, isSignedIn, patchWorkspace, reloadWorkspace, replaceSetlist],
  );

  const addSong = useCallback(
    (
      data: Omit<Song, "id" | "bandId" | "createdAt" | "updatedAt">,
    ): Song => {
      if (!isSignedIn) {
        return runWorkspaceMutation(patchWorkspace, (prev) => {
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
        });
      }

      const now = new Date().toISOString();
      const optimisticId = createId("song");
      const optimistic: Song = {
        ...data,
        id: optimisticId,
        bandId: workspaceBandId,
        createdAt: now,
        updatedAt: now,
      };

      patchWorkspace((prev) => ({
        ...prev,
        songs: [...prev.songs, optimistic],
      }));

      if (!bandId) return optimistic;

      void createSongRequest(bandId, data, getToken)
        .then(({ song }) => {
          patchWorkspace((prev) => ({
            ...prev,
            songs: prev.songs.map((item) =>
              item.id === optimisticId ? song : item,
            ),
          }));
        })
        .catch(() => {
          patchWorkspace((prev) => ({
            ...prev,
            songs: prev.songs.filter((item) => item.id !== optimisticId),
          }));
        });

      return optimistic;
    },
    [bandId, getToken, isSignedIn, patchWorkspace, workspaceBandId],
  );

  const updateSong = useCallback(
    (
      songId: string,
      patch: Partial<
        Omit<Song, "id" | "bandId" | "createdAt" | "updatedAt">
      >,
    ) => {
      patchWorkspace((prev) => ({
        ...prev,
        songs: prev.songs.map((song) =>
          song.id === songId
            ? { ...song, ...patch, updatedAt: new Date().toISOString() }
            : song,
        ),
      }));

      if (isSignedIn && bandId) {
        void updateSongRequest(bandId, songId, patch, getToken)
          .then(({ song }) => {
            patchWorkspace((prev) => ({
              ...prev,
              songs: prev.songs.map((item) =>
                item.id === songId ? song : item,
              ),
            }));
          })
          .catch(() => {
            void reloadWorkspace();
          });
      }
    },
    [bandId, getToken, isSignedIn, patchWorkspace, reloadWorkspace],
  );

  const createSetlist = useCallback(
    (
      data: Omit<
        Setlist,
        "id" | "bandId" | "songIds" | "createdAt" | "updatedAt"
      >,
    ): Setlist | Promise<Setlist> => {
      if (!isSignedIn) {
        return runWorkspaceMutation(patchWorkspace, (prev) => {
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
        });
      }

      if (!bandId) {
        return Promise.reject(new Error("No active band"));
      }

      return createSetlistRequest(bandId, data, getToken).then(({ setlist }) => {
        patchWorkspace((prev) => ({
          ...prev,
          setlists: [...prev.setlists, setlist],
        }));
        return setlist;
      });
    },
    [bandId, getToken, isSignedIn, patchWorkspace],
  );

  const addEvent = useCallback(
    (event: Omit<BandEvent, "id" | "bandId">): BandEvent | Promise<BandEvent> => {
      if (!isSignedIn) {
        return runWorkspaceMutation(patchWorkspace, (prev) => {
          const newEvent: BandEvent = {
            ...event,
            id: createId("event"),
            bandId: prev.band.id,
          };
          return {
            workspace: {
              ...prev,
              events: [...prev.events, newEvent].sort(
                (a, b) =>
                  new Date(a.start).getTime() - new Date(b.start).getTime(),
              ),
            },
            result: newEvent,
          };
        });
      }

      if (!bandId) {
        return Promise.reject(new Error("No active band"));
      }

      return createEventRequest(bandId, event, getToken).then(({ event: saved }) => {
        patchWorkspace((prev) => ({
          ...prev,
          events: [...prev.events, saved].sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          ),
        }));
        return saved;
      });
    },
    [bandId, getToken, isSignedIn, patchWorkspace],
  );

  const value = useMemo<BandWorkspaceContextValue>(
    () => ({
      ...workspace,
      isLoading,
      error,
      reloadWorkspace,
      getSong,
      getSetlist,
      getEvent,
      updateBandName,
      reorderSetlistSongs,
      duplicateSetlist,
      deleteSetlist,
      deleteSong,
      removeSongFromSetlist,
      addSongToSetlist,
      addSong,
      updateSong,
      createSetlist,
      addEvent,
    }),
    [
      workspace,
      isLoading,
      error,
      reloadWorkspace,
      getSong,
      getSetlist,
      getEvent,
      updateBandName,
      reorderSetlistSongs,
      duplicateSetlist,
      deleteSetlist,
      deleteSong,
      removeSongFromSetlist,
      addSongToSetlist,
      addSong,
      updateSong,
      createSetlist,
      addEvent,
    ],
  );

  return (
    <BandWorkspaceContext.Provider value={value}>
      {children}
    </BandWorkspaceContext.Provider>
  );
}
