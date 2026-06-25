import { useActiveBand } from "@/hooks/useActiveBand";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";

export function useBandChat() {
  const { activeBand } = useActiveBand();
  const chatQuery = useChatQuery(activeBand?.id);
  const { members, users, band } = useBandWorkspace();

  return {
    chatMessages: chatQuery.data?.messages ?? [],
    members,
    users,
    band,
    isLoading: chatQuery.isPending,
    error: chatQuery.error,
  };
}
