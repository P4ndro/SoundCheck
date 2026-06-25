export const queryKeys = {
  me: ["me"] as const,
  workspace: (bandId: string) => ["workspace", bandId] as const,
  memberProfile: (bandId: string, userId: string) =>
    ["member", bandId, userId] as const,
  /** Reserved for chat API (Phase 5). */
  chat: (bandId: string) => ["chat", bandId] as const,
  /** Reserved for tabs API (Phase 5). */
  tabs: (bandId: string, songId?: string) =>
    songId ? (["tabs", bandId, songId] as const) : (["tabs", bandId] as const),
};
