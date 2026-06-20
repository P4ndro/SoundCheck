import type { MeResponse } from "@/services/api-client";
import type { SessionContextValue } from "@/context/session-context";
import { SessionContext } from "@/context/session-context";
import { fetchMe } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export function SessionProvider({ children }: { children: ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  const [session, setSession] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    if (!isSignedIn) {
      setSession(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const me = await fetchMe(getToken);
      setSession(me);
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : "Failed to load session";
      setError(message);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, [getToken, isSignedIn]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

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
