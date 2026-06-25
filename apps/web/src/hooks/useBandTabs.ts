import { useActiveBand } from "@/hooks/useActiveBand";
import { useWorkspaceQuery } from "@/hooks/useWorkspaceQuery";

/**
 * Instrument tabs from the workspace cache until a dedicated tabs API exists.
 * Phase 5: replace with useQuery({ queryKey: queryKeys.tabs(bandId, songId), ... }).
 */
export function useBandTabs(songId?: string) {
  const { activeBand } = useActiveBand();
  const { data } = useWorkspaceQuery(activeBand?.id);

  const tabs = data?.tabs ?? [];
  const songs = data?.songs ?? [];

  const filteredTabs = songId
    ? tabs.filter((tab) => tab.songId === songId)
    : tabs;

  return {
    tabs: filteredTabs,
    songs,
  };
}
