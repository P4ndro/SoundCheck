import { describe, expect, it } from "vitest";
import { createSongSchema, updateSongSchema } from "./song.js";

describe("createSongSchema", () => {
  it("accepts a minimal valid song", () => {
    const result = createSongSchema.safeParse({
      title: "Neon Cathedral",
      bpm: 120,
      durationSeconds: 240,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty title", () => {
    const result = createSongSchema.safeParse({
      title: "   ",
      bpm: 120,
      durationSeconds: 240,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid bpm", () => {
    const result = createSongSchema.safeParse({
      title: "Song",
      bpm: 0,
      durationSeconds: 60,
    });
    expect(result.success).toBe(false);
  });

  it("defaults optional string fields", () => {
    const result = createSongSchema.safeParse({
      title: "Song",
      bpm: null,
      durationSeconds: 0,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.timeSignature).toBe("4/4");
      expect(result.data.status).toBe("not_started");
    }
  });
});

describe("updateSongSchema", () => {
  it("requires at least one field", () => {
    expect(updateSongSchema.safeParse({}).success).toBe(false);
  });

  it("accepts partial updates", () => {
    expect(updateSongSchema.safeParse({ title: "Renamed" }).success).toBe(true);
  });
});
