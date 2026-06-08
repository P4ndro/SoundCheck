import { BandWorkspaceContext } from "@/context/band-workspace-context";
import type { BandRole } from "@/types";
import { useContext } from "react";

export function useBandWorkspace() {
  const context = useContext(BandWorkspaceContext);
  if (!context) {
    throw new Error("useBandWorkspace must be used within BandWorkspaceProvider");
  }
  return context;
}

export function useCurrentMemberRole(): BandRole | null {
  const { currentUser, members } = useBandWorkspace();
  const member = members.find((m) => m.userId === currentUser.id);
  return member?.role ?? null;
}
