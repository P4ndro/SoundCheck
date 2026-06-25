import { useSession } from "@/hooks/useSession";
import { queryKeys } from "@/lib/query-keys";
import { fetchWorkspace } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useWorkspaceQuery(bandId: string | undefined) {
  const { isSignedIn, getToken } = useAuth();
  const { session } = useSession();

  const onboardingComplete = session?.onboarding.nextStep === "complete";

  return useQuery({
    queryKey: queryKeys.workspace(bandId ?? ""),
    queryFn: () => fetchWorkspace(bandId!, getToken),
    enabled: Boolean(isSignedIn && onboardingComplete && bandId),
    placeholderData: keepPreviousData,
  });
}
