import { queryKeys } from "@/lib/query-keys";
import { fetchSongTabs } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export function useSongTabsQuery(
  bandId: string | undefined,
  songId: string | undefined,
) {
  const { isSignedIn, getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.tabs(bandId ?? "", songId),
    queryFn: () => fetchSongTabs(bandId!, songId!, getToken),
    enabled: Boolean(bandId && songId && isSignedIn),
    staleTime: 30_000,
  });
}
