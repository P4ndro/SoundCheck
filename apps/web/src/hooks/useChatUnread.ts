import { useChatQuery } from "@/hooks/useChatQuery";
import {
  getChatLastReadAt,
  setChatLastReadAt,
  subscribeChatReadState,
} from "@/lib/chat-read-state";
import type { ChatMessage } from "@/types";
import { useCallback, useMemo, useSyncExternalStore } from "react";

function countUnreadMessages(
  messages: ChatMessage[],
  currentUserId: string,
  lastReadAt: string | null,
): number {
  const threshold = lastReadAt ? new Date(lastReadAt).getTime() : 0;

  return messages.filter(
    (message) =>
      message.senderId !== currentUserId &&
      new Date(message.createdAt).getTime() > threshold,
  ).length;
}

export function useChatUnread(
  bandId: string | undefined,
  currentUserId: string,
) {
  const lastReadAt = useSyncExternalStore(
    subscribeChatReadState,
    () => (bandId ? getChatLastReadAt(bandId) : null),
    () => null,
  );

  const chatQuery = useChatQuery(bandId);

  const unreadCount = useMemo(
    () =>
      countUnreadMessages(
        chatQuery.data?.messages ?? [],
        currentUserId,
        lastReadAt,
      ),
    [chatQuery.data?.messages, currentUserId, lastReadAt],
  );

  const markRead = useCallback(() => {
    if (!bandId) return;

    const messages = chatQuery.data?.messages ?? [];
    const latest = messages[messages.length - 1];
    const readAt = latest?.createdAt ?? new Date().toISOString();

    if (lastReadAt && new Date(readAt).getTime() <= new Date(lastReadAt).getTime()) {
      return;
    }

    setChatLastReadAt(bandId, readAt);
  }, [bandId, chatQuery.data?.messages, lastReadAt]);

  return {
    unreadCount,
    hasUnread: unreadCount > 0,
    markRead,
  };
}
