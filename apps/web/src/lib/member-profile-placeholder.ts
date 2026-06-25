import type { BandMember, MemberProfile, User } from "@/types";

export function buildMemberProfilePlaceholder(
  userId: string,
  members: BandMember[],
  users: User[],
  currentUserId: string,
): MemberProfile | undefined {
  const member = members.find((item) => item.userId === userId);
  if (!member) return undefined;

  const user = users.find((item) => item.id === userId) ?? {
    id: userId,
    name: "Band member",
  };

  return {
    member,
    user,
    isSelf: userId === currentUserId,
    parts: [],
  };
}
