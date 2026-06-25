import { useActiveBand } from "@/hooks/useActiveBand";
import { queryKeys } from "@/lib/query-keys";
import { fetchMemberProfile } from "@/services/api-client";
import type { MemberProfile } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useMemberProfileQuery(userId: string | undefined) {
  const { getToken } = useAuth();
  const { activeBand } = useActiveBand();
  const bandId = activeBand?.id;

  return useQuery({
    queryKey: queryKeys.memberProfile(bandId ?? "", userId ?? ""),
    queryFn: () => fetchMemberProfile(bandId!, userId!, getToken),
    enabled: Boolean(bandId && userId),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}

export function resolveMemberProfile(
  queryData: MemberProfile | undefined,
  workspacePlaceholder: MemberProfile | undefined,
): MemberProfile | undefined {
  return queryData ?? workspacePlaceholder;
}
