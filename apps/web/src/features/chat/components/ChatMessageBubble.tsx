import { MemberAvatar } from "@/features/chat/components/MemberAvatar";
import {
  formatChatTimestamp,
  isLastInCluster,
} from "@/features/chat/lib/chat-utils";
import type { ChatMessage, User } from "@/types";

export interface ChatMessageBubbleProps {
  message: ChatMessage;
  sender: User;
  isOwn: boolean;
  showHeader: boolean;
  allMessages: ChatMessage[];
  messageIndex: number;
}

export function ChatMessageBubble({
  message,
  sender,
  isOwn,
  showHeader,
  allMessages,
  messageIndex,
}: ChatMessageBubbleProps) {
  const isImage = message.type === "image" && message.imageUrl;
  const lastInCluster = isLastInCluster(allMessages, messageIndex);

  if (isOwn) {
    return (
      <div className="flex flex-col items-end gap-1">
        {isImage ? (
          <figure className="max-w-[min(85%,480px)] overflow-hidden rounded-xl rounded-br-sm">
            <img
              src={message.imageUrl}
              alt={message.imageCaption ?? "Shared photo"}
              className="block w-full object-cover"
              style={{ maxHeight: "280px" }}
              loading="lazy"
            />
            {message.imageCaption && (
              <figcaption className="bg-accent px-3 py-2 text-sm leading-snug text-foreground">
                {message.imageCaption}
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="max-w-[min(85%,480px)] rounded-xl rounded-br-sm bg-accent px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {message.text}
          </div>
        )}
        {lastInCluster && (
          <span className="pr-1 text-[10px] text-subtle">
            {formatChatTimestamp(message.createdAt)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[36px_1fr] items-end gap-x-2.5">
      <div className="flex justify-center self-end">
        {showHeader ? (
          <MemberAvatar userId={sender.id} name={sender.name} size="sm" />
        ) : null}
      </div>

      <div className="min-w-0 flex flex-col gap-1">
        {showHeader && (
          <span className="text-[11px] font-medium text-muted">
            {sender.name.split(" ")[0]}
          </span>
        )}

        {isImage ? (
          <figure className="max-w-[min(100%,480px)] overflow-hidden rounded-xl rounded-bl-sm border border-border">
            <img
              src={message.imageUrl}
              alt={message.imageCaption ?? "Shared photo"}
              className="block w-full object-cover"
              style={{ maxHeight: "280px" }}
              loading="lazy"
            />
            {message.imageCaption && (
              <figcaption className="border-t border-border bg-surface-2 px-3 py-2 text-sm leading-snug text-foreground">
                {message.imageCaption}
              </figcaption>
            )}
          </figure>
        ) : (
          <div className="max-w-[min(100%,480px)] rounded-xl rounded-bl-sm border border-border bg-surface-2 px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
            {message.text}
          </div>
        )}

        {lastInCluster && (
          <span className="text-[10px] text-subtle">
            {formatChatTimestamp(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
