export function parseDurationInput(minutes: string, seconds: string): number {
  const m = Math.max(0, parseInt(minutes, 10) || 0);
  const s = Math.max(0, Math.min(59, parseInt(seconds, 10) || 0));
  return m * 60 + s;
}

export function splitDuration(seconds: number): { minutes: string; seconds: string } {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return { minutes: String(m), seconds: String(s) };
}
