export const queryKeys = {
  me: ["me"] as const,
  workspace: (bandId: string) => ["workspace", bandId] as const,
  memberProfile: (bandId: string, userId: string) =>
    ["member", bandId, userId] as const,
  chat: (bandId: string) => ["chat", bandId] as const,
  tabs: (bandId: string, songId?: string) =>
    songId ? (["tabs", bandId, songId] as const) : (["tabs", bandId] as const),
};
