import { describe, expect, it } from "vitest";
import { createEventSchema } from "./event.js";

describe("createEventSchema", () => {
  it("accepts a valid event", () => {
    const result = createEventSchema.safeParse({
      title: "Rehearsal",
      type: "rehearsal",
      start: "2026-06-10T19:00:00.000Z",
      end: "2026-06-10T22:00:00.000Z",
    });
    expect(result.success).toBe(true);
  });

  it("rejects end before start", () => {
    const result = createEventSchema.safeParse({
      title: "Rehearsal",
      type: "rehearsal",
      start: "2026-06-10T22:00:00.000Z",
      end: "2026-06-10T19:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });

  it("rejects equal start and end", () => {
    const result = createEventSchema.safeParse({
      title: "Rehearsal",
      type: "rehearsal",
      start: "2026-06-10T19:00:00.000Z",
      end: "2026-06-10T19:00:00.000Z",
    });
    expect(result.success).toBe(false);
  });
});
