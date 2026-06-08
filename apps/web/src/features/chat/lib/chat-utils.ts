import { formatTime } from "@/lib/format";
import type { ChatMessage } from "@/types";

export interface ChatDayGroup {
  label: string;
  messages: ChatMessage[];
}

const CLUSTER_GAP_MS = 5 * 60 * 1000;

export { getInitials } from "@/lib/user";

const AVATAR_STYLES = [
  "bg-accent-subtle text-accent-muted ring-accent/30",
  "bg-surface-3 text-muted ring-border",
  "bg-violet-500/20 text-violet-200 ring-violet-400/30",
  "bg-sky-500/15 text-sky-200 ring-sky-400/25",
] as const;

export function avatarStyleForUser(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_STYLES[Math.abs(hash) % AVATAR_STYLES.length];
}

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const startOfMessage = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const diffDays = Math.round(
    (startOfToday.getTime() - startOfMessage.getTime()) / 86_400_000,
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function groupMessagesByDay(messages: ChatMessage[]): ChatDayGroup[] {
  const groups: ChatDayGroup[] = [];

  for (const message of messages) {
    const label = dayLabel(message.createdAt);
    const last = groups[groups.length - 1];
    if (last?.label === label) {
      last.messages.push(message);
    } else {
      groups.push({ label, messages: [message] });
    }
  }

  return groups;
}

export function formatChatTimestamp(iso: string): string {
  return formatTime(iso);
}

export function shouldShowSenderHeader(
  messages: ChatMessage[],
  index: number,
): boolean {
  const current = messages[index];
  const previous = messages[index - 1];
  if (!previous) return true;
  if (previous.senderId !== current.senderId) return true;

  const gap =
    new Date(current.createdAt).getTime() -
    new Date(previous.createdAt).getTime();
  return gap > CLUSTER_GAP_MS;
}

export function isLastInCluster(
  messages: ChatMessage[],
  index: number,
): boolean {
  const current = messages[index];
  const next = messages[index + 1];
  if (!next) return true;
  if (next.senderId !== current.senderId) return true;

  const gap =
    new Date(next.createdAt).getTime() -
    new Date(current.createdAt).getTime();
  return gap > CLUSTER_GAP_MS;
}

export function memberSummary(names: string[]): string {
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} +${names.length - 2}`;
}
