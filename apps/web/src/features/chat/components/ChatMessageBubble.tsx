import { MemberAvatar } from "@/features/chat/components/MemberAvatar";
import {
  formatChatTimestamp,
  isLastInCluster,
} from "@/features/chat/lib/chat-utils";
import { cn } from "@/lib/cn";
import type { ChatMessage, User } from "@/types";

export interface ChatMessageBubbleProps {
  message: ChatMessage;
  sender: User;
  isOwn: boolean;
  showHeader: boolean;
  allMessages: ChatMessage[];
  messageIndex: number;
  onImageClick?: (imageUrl: string, caption?: string) => void;
}

export function ChatMessageBubble({
  message,
  sender,
  isOwn,
  showHeader,
  allMessages,
  messageIndex,
  onImageClick,
}: ChatMessageBubbleProps) {
  const isImage = message.type === "image" && message.imageUrl;
  const lastInCluster = isLastInCluster(allMessages, messageIndex);
  const firstName = sender.name.split(" ")[0];

  const openImage = () => {
    if (!message.imageUrl) return;
    onImageClick?.(message.imageUrl, message.imageCaption);
  };

  const imageBubble = (
    <figure
      className={cn(
        "overflow-hidden",
        isOwn
          ? "rounded-[18px] rounded-br-[4px] ring-1 ring-accent/30"
          : "rounded-[18px] rounded-bl-[4px] border border-border",
      )}
    >
      <button
        type="button"
        onClick={openImage}
        className="block w-full cursor-zoom-in text-left"
        aria-label={message.imageCaption ?? "View shared photo"}
      >
        <img
          src={message.imageUrl}
          alt={message.imageCaption ?? "Shared photo"}
          className="block max-h-72 w-full object-cover"
          loading="lazy"
        />
      </button>
      {message.imageCaption && (
        <figcaption
          className={cn(
            "px-3 py-2 text-sm leading-snug",
            isOwn
              ? "bg-accent text-foreground"
              : "border-t border-border bg-surface-2 text-foreground",
          )}
        >
          {message.imageCaption}
        </figcaption>
      )}
    </figure>
  );

  const textBubble = (
    <div
      className={cn(
        "inline-block max-w-full px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap",
        isOwn
          ? "rounded-[18px] rounded-br-[4px] bg-accent text-foreground"
          : "rounded-[18px] rounded-bl-[4px] border border-border bg-surface-2 text-foreground",
      )}
    >
      {message.text}
    </div>
  );

  if (isOwn) {
    return (
      <div className="group/message flex flex-col items-end gap-1">
        {isImage ? imageBubble : textBubble}
        {lastInCluster && (
          <span className="pr-0.5 text-[10px] text-subtle">
            {formatChatTimestamp(message.createdAt)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="group/message flex items-end gap-2">
      <div className="shrink-0 self-end">
        {showHeader ? (
          <MemberAvatar userId={sender.id} name={sender.name} size="xs" />
        ) : (
          <span className="block h-7 w-7" aria-hidden />
        )}
      </div>

      <div className="min-w-0 flex flex-col gap-1">
        {showHeader && (
          <span className="pl-1 text-[11px] font-semibold text-muted">
            {firstName}
          </span>
        )}

        {isImage ? imageBubble : textBubble}

        {lastInCluster && (
          <span className="pl-1 text-[10px] text-subtle">
            {formatChatTimestamp(message.createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}
