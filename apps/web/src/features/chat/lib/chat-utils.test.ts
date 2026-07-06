import { describe, expect, it } from "vitest";
import {
  groupMessagesByDay,
  shouldAddClusterGap,
  shouldShowSenderHeader,
} from "@/features/chat/lib/chat-utils";
import type { ChatMessage } from "@/types";

function message(
  id: string,
  senderId: string,
  createdAt: string,
): ChatMessage {
  return {
    id,
    bandId: "band-1",
    senderId,
    type: "text",
    text: "hello",
    createdAt,
  };
}

describe("groupMessagesByDay", () => {
  it("groups consecutive messages on the same day", () => {
    const messages = [
      message("1", "user-a", "2026-06-06T10:00:00.000Z"),
      message("2", "user-b", "2026-06-06T10:05:00.000Z"),
      message("3", "user-a", "2026-06-05T10:00:00.000Z"),
    ];

    const groups = groupMessagesByDay(messages);
    expect(groups).toHaveLength(2);
    expect(groups[0]?.messages).toHaveLength(2);
    expect(groups[1]?.messages).toHaveLength(1);
  });
});

describe("shouldShowSenderHeader", () => {
  const messages = [
    message("1", "user-a", "2026-06-06T10:00:00.000Z"),
    message("2", "user-a", "2026-06-06T10:02:00.000Z"),
    message("3", "user-b", "2026-06-06T10:03:00.000Z"),
    message("4", "user-a", "2026-06-06T10:10:00.000Z"),
  ];

  it("shows header for first message", () => {
    expect(shouldShowSenderHeader(messages, 0)).toBe(true);
  });

  it("hides header for same sender within cluster gap", () => {
    expect(shouldShowSenderHeader(messages, 1)).toBe(false);
  });

  it("shows header when sender changes", () => {
    expect(shouldShowSenderHeader(messages, 2)).toBe(true);
  });
});

describe("shouldAddClusterGap", () => {
  const messages = [
    message("1", "user-a", "2026-06-06T10:00:00.000Z"),
    message("2", "user-b", "2026-06-06T10:01:00.000Z"),
  ];

  it("does not add gap before first message", () => {
    expect(shouldAddClusterGap(messages, 0)).toBe(false);
  });

  it("adds gap when a new cluster starts", () => {
    expect(shouldAddClusterGap(messages, 1)).toBe(true);
  });
});
