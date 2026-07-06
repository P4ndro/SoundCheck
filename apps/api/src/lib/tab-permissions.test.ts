import { describe, expect, it } from "vitest";
import {
  assertCanEditTabInstrument,
  instrumentForMemberRole,
} from "./tab-permissions.js";
import { ApiError } from "../middleware/error-handler.js";

describe("instrumentForMemberRole", () => {
  it("maps instrument roles to instruments", () => {
    expect(instrumentForMemberRole("bass")).toBe("bass");
    expect(instrumentForMemberRole("drums")).toBe("drums");
    expect(instrumentForMemberRole("lead_guitar")).toBe("lead_guitar");
  });

  it("rejects custom roles", () => {
    expect(() => instrumentForMemberRole("custom")).toThrow(ApiError);
    expect(() => instrumentForMemberRole("custom")).toThrow(
      "Custom roles cannot edit instrument notation",
    );
  });
});

describe("assertCanEditTabInstrument", () => {
  it("allows editing own instrument", () => {
    expect(() =>
      assertCanEditTabInstrument("bass", "bass"),
    ).not.toThrow();
  });

  it("denies editing another instrument", () => {
    expect(() => assertCanEditTabInstrument("bass", "drums")).toThrow(ApiError);
    expect(() => assertCanEditTabInstrument("bass", "drums")).toThrow(
      "You can only edit notation for your own instrument",
    );
  });
});
