export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/[\s-]+/g, "");
}

export function formatInviteCodeForDisplay(code: string): string {
  const normalized = normalizeInviteCode(code);
  if (normalized.length === 8) {
    return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
  }
  return normalized;
}
