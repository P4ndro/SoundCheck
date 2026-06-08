import { getInitials, memberSummary } from "@/features/chat/lib/chat-utils";
import type { Band, BandMember, User } from "@/types";
import { Users } from "lucide-react";

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

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-1 px-6 py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-sm font-semibold text-accent-muted">
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

      <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-1 text-xs text-muted">
        <Users className="h-3.5 w-3.5 text-subtle" />
        <span>{members.length}</span>
      </div>
    </header>
  );
}
