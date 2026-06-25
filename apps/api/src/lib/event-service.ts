import { prisma } from "./prisma.js";
import { serializeEvent } from "./serializers.js";
import { ApiError } from "../middleware/error-handler.js";

export async function getEventInBandOrThrow(eventId: string, bandId: string) {
  const event = await prisma.bandEvent.findFirst({
    where: { id: eventId, bandId },
  });

  if (!event) {
    throw new ApiError(404, "Event not found");
  }

  return event;
}

export async function assertSetlistInBand(
  bandId: string,
  setlistId: string,
): Promise<void> {
  const setlist = await prisma.setlist.findFirst({
    where: { id: setlistId, bandId },
    select: { id: true },
  });

  if (!setlist) {
    throw new ApiError(404, "Setlist not found");
  }
}

export function serializeEventRecord(
  event: Parameters<typeof serializeEvent>[0],
) {
  return serializeEvent(event);
}
