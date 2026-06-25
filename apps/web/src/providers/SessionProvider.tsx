import type { MeResponse } from "@/services/api-client";
import type { SessionContextValue } from "@/context/session-context";
import { SessionContext } from "@/context/session-context";
import { queryKeys } from "@/lib/query-keys";
import { fetchMe } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, type ReactNode } from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: session = null,
    isPending,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.me,
    queryFn: () => fetchMe(getToken),
    enabled: isSignedIn,
  });

  const isLoading = Boolean(isPending && session === null && isSignedIn);
  const error =
    queryError instanceof Error
      ? queryError.message
      : queryError
        ? "Failed to load session"
        : null;

  const refreshSession = useCallback(async () => {
    if (!isSignedIn) {
      queryClient.setQueryData<MeResponse | null>(queryKeys.me, null);
      return;
    }

    await refetch();
  }, [isSignedIn, queryClient, refetch]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      isLoading,
      error,
      refreshSession,
    }),
    [session, isLoading, error, refreshSession],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}
