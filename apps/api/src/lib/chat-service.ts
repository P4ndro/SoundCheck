import { prisma } from "./prisma.js";
import { serializeChatMessage } from "./serializers.js";

export type CreateChatMessageData =
  | { type: "text"; text: string }
  | { type: "image"; imageUrl: string; imageCaption?: string };

export async function listChatMessages(
  bandId: string,
  options: { after?: Date; limit: number },
) {
  if (options.after) {
    return prisma.chatMessage.findMany({
      where: {
        bandId,
        createdAt: { gt: options.after },
      },
      orderBy: { createdAt: "asc" },
      take: options.limit,
    });
  }

  const messages = await prisma.chatMessage.findMany({
    where: { bandId },
    orderBy: { createdAt: "desc" },
    take: options.limit,
  });

  return messages.reverse();
}

export async function createChatMessage(
  bandId: string,
  senderId: string,
  input: CreateChatMessageData,
) {
  const now = new Date();
  const id = `msg-${crypto.randomUUID().slice(0, 8)}`;

  if (input.type === "text") {
    return prisma.chatMessage.create({
      data: {
        id,
        bandId,
        senderId,
        type: "text",
        text: input.text,
        createdAt: now,
      },
    });
  }

  return prisma.chatMessage.create({
    data: {
      id,
      bandId,
      senderId,
      type: "image",
      imageUrl: input.imageUrl,
      imageCaption: input.imageCaption ?? null,
      createdAt: now,
    },
  });
}

export function serializeChatMessageRecord(
  message: Parameters<typeof serializeChatMessage>[0],
) {
  return serializeChatMessage(message);
}
