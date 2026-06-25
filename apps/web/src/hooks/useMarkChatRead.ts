import { usePageVisible } from "@/hooks/usePageVisible";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useEffect } from "react";
import { useMatch } from "react-router-dom";

export function useMarkChatRead(
  bandId: string | undefined,
  markRead: () => void,
) {
  const isChatRoute = useMatch("/chat") != null;
  const isPageVisible = usePageVisible();
  const chatQuery = useChatQuery(bandId);
  const lastMessageId = chatQuery.data?.messages.at(-1)?.id;

  useEffect(() => {
    if (!bandId || !isChatRoute || !isPageVisible || !chatQuery.data) {
      return;
    }

    markRead();
  }, [bandId, isChatRoute, isPageVisible, lastMessageId, markRead, chatQuery.data]);
}
