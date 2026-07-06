import { useActiveBand } from "@/hooks/useActiveBand";
import { useBandTabsQuery } from "@/hooks/useBandTabsQuery";
import { useSongTabsQuery } from "@/hooks/useSongTabsQuery";
import { useWorkspaceQuery } from "@/hooks/useWorkspaceQuery";

export function useBandTabs(songId?: string) {
  const { activeBand } = useActiveBand();
  const bandId = activeBand?.id;
  const workspaceQuery = useWorkspaceQuery(bandId);
  const bandTabsQuery = useBandTabsQuery(bandId);
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
    tabs: bandTabsQuery.data?.tabs ?? [],
    songs,
    isLoading: bandTabsQuery.isPending,
    error: bandTabsQuery.error,
  };
}
