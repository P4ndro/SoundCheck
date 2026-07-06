import { describe, expect, it } from "vitest";
import {
  buildInviteShareUrl,
  isInviteActive,
  serializeBandInvite,
} from "./invite-service.js";

const baseInvite = {
  id: "invite-1",
  code: "ABCD1234",
  expiresAt: null,
  maxUses: null,
  useCount: 0,
};

describe("isInviteActive", () => {
  it("returns true for a valid invite", () => {
    expect(isInviteActive(baseInvite)).toBe(true);
  });

  it("returns false when expired", () => {
    const now = new Date("2026-06-01T12:00:00.000Z");
    expect(
      isInviteActive(
        {
          ...baseInvite,
          expiresAt: new Date("2026-06-01T11:00:00.000Z"),
        },
        now,
      ),
    ).toBe(false);
  });

  it("returns false when max uses reached", () => {
    expect(
      isInviteActive({
        ...baseInvite,
        maxUses: 5,
        useCount: 5,
      }),
    ).toBe(false);
  });

  it("returns true when under max uses", () => {
    expect(
      isInviteActive({
        ...baseInvite,
        maxUses: 5,
        useCount: 4,
      }),
    ).toBe(true);
  });
});

describe("buildInviteShareUrl", () => {
  it("builds a join URL with encoded code", () => {
    expect(buildInviteShareUrl("ABCD1234")).toBe(
      "http://localhost:5173/join?code=ABCD1234",
    );
  });
});

describe("serializeBandInvite", () => {
  it("marks active invites as active", () => {
    expect(serializeBandInvite(baseInvite)).toEqual({
      code: "ABCD1234",
      shareUrl: "http://localhost:5173/join?code=ABCD1234",
      status: "active",
    });
  });

  it("marks expired invites as expired", () => {
    expect(
      serializeBandInvite({
        ...baseInvite,
        expiresAt: new Date("2026-06-01T11:00:00.000Z"),
      }).status,
    ).toBe("expired");
  });
});
