import type { BandMember, BandRole, Instrument, User } from "@/types";

export const roleLabels: Record<BandRole, string> = {
  bass: "Bass",
  drums: "Drums",
  vocals: "Vocals",
  lead_guitar: "Lead guitar",
  rhythm_guitar: "Rhythm guitar",
  custom: "Custom",
};

export function roleToInstrument(role: BandRole): Instrument | null {
  if (role === "custom") return null;
  return role;
}

export function getMemberLabel(
  member: BandMember,
  users: User[],
): { name: string; role: string } {
  const user = users.find((u) => u.id === member.userId);
  const role =
    member.role === "custom" && member.customRoleLabel
      ? member.customRoleLabel
      : roleLabels[member.role];

  return {
    name: user?.name ?? "Unknown",
    role,
  };
}
