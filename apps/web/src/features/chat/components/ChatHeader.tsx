import { MemberAvatar } from "@/features/chat/components/MemberAvatar";
import { getInitials, memberSummary } from "@/features/chat/lib/chat-utils";
import type { Band, BandMember, User } from "@/types";

export interface ChatHeaderProps {
  band: Band;
  members: BandMember[];
  users: User[];
}

export function ChatHeader({ band, members, users }: ChatHeaderProps) {
  const memberUsers = members
    .map((member) => users.find((u) => u.id === member.userId))
    .filter(Boolean) as User[];

  const firstNames = memberUsers.map((u) => u.name.split(" ")[0]);
  const visibleAvatars = memberUsers.slice(0, 4);
  const overflowCount = Math.max(0, memberUsers.length - visibleAvatars.length);

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-1 px-4 py-3 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-sm font-semibold text-accent-muted ring-1 ring-accent/20">
          {getInitials(band.name)}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {band.name}
          </h2>
          <p className="mt-0.5 truncate text-xs text-muted">
            {memberSummary(firstNames)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center -space-x-2">
          {visibleAvatars.map((user) => (
            <MemberAvatar
              key={user.id}
              userId={user.id}
              name={user.name}
              size="xs"
              className="ring-2 ring-surface-1"
            />
          ))}
          {overflowCount > 0 && (
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-3 text-[10px] font-semibold text-muted ring-2 ring-surface-1"
              aria-label={`${overflowCount} more members`}
            >
              +{overflowCount}
            </div>
          )}
        </div>
        <span className="hidden text-xs text-subtle sm:inline">
          {members.length} {members.length === 1 ? "member" : "members"}
        </span>
      </div>
    </header>
  );
}
