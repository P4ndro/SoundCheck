import { ChatMessageBubble } from "@/features/chat/components/ChatMessageBubble";
import {
  ChatImageLightbox,
  type ChatImagePreview,
} from "@/features/chat/components/ChatImageLightbox";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  groupMessagesByDay,
  isScrollNearBottom,
  shouldAddClusterGap,
  shouldShowSenderHeader,
} from "@/features/chat/lib/chat-utils";
import { cn } from "@/lib/cn";
import type { ChatMessage, User } from "@/types";
import { MessageCircle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessageListProps {
  messages: ChatMessage[];
  users: User[];
  currentUserId: string;
  isLoading?: boolean;
}

function ChatDayDivider({ label }: { label: string }) {
  return (
    <div
      className="flex w-full items-center gap-3 py-2"
      role="separator"
      aria-label={label}
    >
      <div className="h-px flex-1 bg-border-subtle" />
      <span className="shrink-0 text-[11px] font-medium text-subtle">
        {label}
      </span>
      <div className="h-px flex-1 bg-border-subtle" />
    </div>
  );
}

function ChatLoadingSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 px-4 py-5 sm:px-6">
      <div className="flex justify-start gap-2">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-surface-3" />
        <div className="h-10 w-52 animate-pulse rounded-[18px] rounded-bl-[4px] bg-surface-3" />
      </div>
      <div className="flex justify-end">
        <div className="h-10 w-40 animate-pulse rounded-[18px] rounded-br-[4px] bg-accent/30" />
      </div>
      <div className="flex justify-start gap-2">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-surface-3" />
        <div className="h-10 w-64 animate-pulse rounded-[18px] rounded-bl-[4px] bg-surface-3" />
      </div>
    </div>
  );
}

export function ChatMessageList({
  messages,
  users,
  currentUserId,
  isLoading = false,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stickToBottomRef = useRef(true);
  const [lightbox, setLightbox] = useState<ChatImagePreview | null>(null);
  const dayGroups = groupMessagesByDay(messages);

  const handleScroll = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    stickToBottomRef.current = isScrollNearBottom(container);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !stickToBottomRef.current) return;

    const lastMessage = messages[messages.length - 1];
    container.scrollTo({
      top: container.scrollHeight,
      behavior: lastMessage && messages.length > 3 ? "smooth" : "auto",
    });
  }, [messages.length, messages[messages.length - 1]?.id]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatLoadingSkeleton />
      </div>
    );
  }

  if (!isLoading && messages.length === 0) {
    return (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <EmptyState
          icon={MessageCircle}
          title="Start the conversation"
          description="Share rehearsal updates, setlist notes, or gig details with your bandmates."
          className="h-full py-24"
        />
      </div>
    );
  }

  return (
    <>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="scroll-smooth-touch min-h-0 flex-1 overflow-y-auto overscroll-y-contain"
      >
        <div className="flex w-full flex-col gap-4 px-4 py-4 sm:px-6">
          {dayGroups.map((group) => (
            <section key={group.label} className="flex w-full flex-col gap-2">
              <ChatDayDivider label={group.label} />

              {group.messages.map((message, index) => {
                const sender = users.find((u) => u.id === message.senderId);
                if (!sender) return null;

                const globalIndex = messages.findIndex(
                  (m) => m.id === message.id,
                );
                const isOwn = message.senderId === currentUserId;
                const clusterGap = shouldAddClusterGap(group.messages, index);

                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex w-full",
                      isOwn ? "justify-end" : "justify-start",
                      clusterGap ? "mt-3" : index > 0 ? "mt-0.5" : "",
                    )}
                  >
                    <div
                      className={cn(
                        "min-w-0",
                        isOwn ? "max-w-[min(78%,28rem)]" : "max-w-[min(78%,28rem)]",
                      )}
                    >
                      <ChatMessageBubble
                        message={message}
                        sender={sender}
                        isOwn={isOwn}
                        showHeader={shouldShowSenderHeader(
                          group.messages,
                          index,
                        )}
                        allMessages={messages}
                        messageIndex={globalIndex}
                        onImageClick={(imageUrl, caption) =>
                          setLightbox({ imageUrl, caption })
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </section>
          ))}
        </div>
      </div>

      {lightbox && (
        <ChatImageLightbox
          imageUrl={lightbox.imageUrl}
          caption={lightbox.caption}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
