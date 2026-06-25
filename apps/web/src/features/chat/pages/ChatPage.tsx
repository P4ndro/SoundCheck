import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatMessageList } from "@/features/chat/components/ChatMessageList";
import { useActiveBand } from "@/hooks/useActiveBand";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";
import { useChatQuery } from "@/hooks/useChatQuery";
import { useChatUnread } from "@/hooks/useChatUnread";
import { useMarkChatRead } from "@/hooks/useMarkChatRead";
import { useSendChatMessage } from "@/hooks/useSendChatMessage";

export function ChatPage() {
  const { activeBand } = useActiveBand();
  const { band, members, users, currentUser } = useBandWorkspace();
  const chatQuery = useChatQuery(activeBand?.id);
  const { markRead } = useChatUnread(activeBand?.id, currentUser.id);
  useMarkChatRead(activeBand?.id, markRead);
  const sendMessage = useSendChatMessage(activeBand?.id);

  const messages = chatQuery.data?.messages ?? [];

  const handleSend = (payload: { text?: string; imageUrl?: string }) => {
    sendMessage.mutate(payload);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
      <ChatHeader band={band} members={members} users={users} />

      <ChatMessageList
        messages={messages}
        users={users}
        currentUserId={currentUser.id}
        isLoading={chatQuery.isPending && messages.length === 0}
      />

      {chatQuery.error && (
        <div
          className="shrink-0 border-t border-danger/30 bg-danger-subtle px-4 py-2 text-center text-sm text-danger sm:px-6"
          role="alert"
        >
          {chatQuery.error instanceof Error
            ? chatQuery.error.message
            : "Failed to load messages"}
        </div>
      )}

      <ChatComposer
        onSend={handleSend}
        disabled={Boolean(chatQuery.error)}
        isSending={sendMessage.isPending}
      />
    </div>
  );
}
