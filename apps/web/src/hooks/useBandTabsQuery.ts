import { queryKeys } from "@/lib/query-keys";
import { fetchBandTabs } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";

export function useBandTabsQuery(bandId: string | undefined) {
  const { isSignedIn, getToken } = useAuth();

  return useQuery({
    queryKey: queryKeys.tabs(bandId ?? ""),
    queryFn: () => fetchBandTabs(bandId!, getToken),
    enabled: Boolean(bandId && isSignedIn),
    staleTime: 30_000,
  });
}
