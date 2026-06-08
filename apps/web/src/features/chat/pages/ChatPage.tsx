import { ChatComposer } from "@/features/chat/components/ChatComposer";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import { ChatMessageList } from "@/features/chat/components/ChatMessageList";
import { useBandWorkspace } from "@/hooks/useBandWorkspace";

export function ChatPage() {
  const {
    band,
    members,
    users,
    chatMessages,
    currentUser,
    sendChatMessage,
  } = useBandWorkspace();

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ChatHeader band={band} members={members} users={users} />
      <ChatMessageList
        messages={chatMessages}
        users={users}
        currentUserId={currentUser.id}
      />
      <ChatComposer onSend={sendChatMessage} />
    </div>
  );
}
