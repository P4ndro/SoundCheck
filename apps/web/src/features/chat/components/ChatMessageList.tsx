import { ChatMessageBubble } from "@/features/chat/components/ChatMessageBubble";
import {
  groupMessagesByDay,
  shouldShowSenderHeader,
} from "@/features/chat/lib/chat-utils";
import type { ChatMessage, User } from "@/types";
import { useEffect, useRef } from "react";

export interface ChatMessageListProps {
  messages: ChatMessage[];
  users: User[];
  currentUserId: string;
}

export function ChatMessageList({
  messages,
  users,
  currentUserId,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dayGroups = groupMessagesByDay(messages);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={scrollRef}
      className="scroll-smooth-touch min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
    >
      <div className="flex flex-col gap-6 px-6 py-5">
        {dayGroups.map((group) => (
          <section key={group.label}>
            <p className="mb-3 text-center text-[11px] font-medium text-subtle">
              {group.label}
            </p>

            <div className="space-y-2">
              {group.messages.map((message, index) => {
                const sender = users.find((u) => u.id === message.senderId);
                if (!sender) return null;

                const globalIndex = messages.findIndex(
                  (m) => m.id === message.id,
                );

                return (
                  <ChatMessageBubble
                    key={message.id}
                    message={message}
                    sender={sender}
                    isOwn={message.senderId === currentUserId}
                    showHeader={shouldShowSenderHeader(group.messages, index)}
                    allMessages={messages}
                    messageIndex={globalIndex}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
