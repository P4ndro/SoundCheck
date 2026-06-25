import { usePageVisible } from "@/hooks/usePageVisible";
import { queryKeys } from "@/lib/query-keys";
import { fetchChatMessages } from "@/services/api-client";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { useMatch } from "react-router-dom";

const CHAT_POLL_INTERVAL_MS = 4_000;

export function useChatQuery(bandId: string | undefined) {
  const { isSignedIn, getToken } = useAuth();
  const isPageVisible = usePageVisible();
  const isChatRoute = useMatch("/chat") != null;

  const pollingActive = Boolean(
    bandId && isSignedIn && isChatRoute && isPageVisible,
  );

  return useQuery({
    queryKey: queryKeys.chat(bandId ?? ""),
    queryFn: () => fetchChatMessages(bandId!, getToken),
    enabled: Boolean(bandId && isSignedIn),
    staleTime: 0,
    refetchInterval: pollingActive ? CHAT_POLL_INTERVAL_MS : false,
    refetchIntervalInBackground: false,
  });
}
