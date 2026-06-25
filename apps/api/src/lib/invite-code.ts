const INVITE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateInviteCode(length = 8): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let code = "";
  for (let index = 0; index < length; index += 1) {
    code += INVITE_ALPHABET[bytes[index]! % INVITE_ALPHABET.length];
  }
  return code;
}

export function normalizeInviteCode(code: string): string {
  return code.trim().toUpperCase().replace(/[\s-]+/g, "");
}
