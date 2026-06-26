import { useActiveBand } from "@/hooks/useActiveBand";
import { useSongTabsQuery } from "@/hooks/useSongTabsQuery";
import { useWorkspaceQuery } from "@/hooks/useWorkspaceQuery";

export function useBandTabs(songId?: string) {
  const { activeBand } = useActiveBand();
  const bandId = activeBand?.id;
  const workspaceQuery = useWorkspaceQuery(bandId);
  const songTabsQuery = useSongTabsQuery(bandId, songId);

  const songs = workspaceQuery.data?.songs ?? [];

  if (songId) {
    return {
      tabs: songTabsQuery.data?.tabs ?? [],
      songs,
      isLoading: songTabsQuery.isPending,
      error: songTabsQuery.error,
    };
  }

  return {
    tabs: workspaceQuery.data?.tabs ?? [],
    songs,
    isLoading: workspaceQuery.isPending,
    error: workspaceQuery.error,
  };
}
