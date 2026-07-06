import { describe, expect, it } from "vitest";
import {
  formatInviteCodeForDisplay,
  normalizeInviteCode,
} from "./invite-code";

describe("normalizeInviteCode", () => {
  it("trims, uppercases, and removes separators", () => {
    expect(normalizeInviteCode(" abcd-1234 ")).toBe("ABCD1234");
    expect(normalizeInviteCode("abcd 1234")).toBe("ABCD1234");
  });
});

describe("formatInviteCodeForDisplay", () => {
  it("formats 8-character codes with a hyphen", () => {
    expect(formatInviteCodeForDisplay("abcd1234")).toBe("ABCD-1234");
  });

  it("returns normalized code when length is not 8", () => {
    expect(formatInviteCodeForDisplay("abc")).toBe("ABC");
  });
});
