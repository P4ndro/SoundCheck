import { describe, expect, it } from "vitest";
import { createTabSchema, updateTabSchema } from "./tab.js";

describe("createTabSchema", () => {
  it("accepts ascii tab content", () => {
    const result = createTabSchema.safeParse({ asciiTab: "G|---|" });
    expect(result.success).toBe(true);
  });

  it("accepts chord chart content", () => {
    const result = createTabSchema.safeParse({ chordChart: "Am F C G" });
    expect(result.success).toBe(true);
  });

  it("rejects empty notation", () => {
    const result = createTabSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects capo outside 0-24", () => {
    const result = createTabSchema.safeParse({
      asciiTab: "G|---|",
      capo: 25,
    });
    expect(result.success).toBe(false);
  });

  it("coerces capo from string", () => {
    const result = createTabSchema.safeParse({
      asciiTab: "G|---|",
      capo: "3",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.capo).toBe(3);
    }
  });
});

describe("updateTabSchema", () => {
  it("requires at least one field", () => {
    expect(updateTabSchema.safeParse({}).success).toBe(false);
  });

  it("accepts partial updates", () => {
    expect(updateTabSchema.safeParse({ asciiTab: "updated" }).success).toBe(
      true,
    );
  });
});
