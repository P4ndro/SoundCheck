import { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";
import { serializeSetlist } from "./serializers.js";
import { ApiError } from "../middleware/error-handler.js";

const POSITION_OFFSET = 10_000;

type SetlistWithItems = Prisma.SetlistGetPayload<{
  include: { items: true };
}>;

export function serializeSetlistRecord(
  setlist: SetlistWithItems,
  updatedAt?: Date,
) {
  const songIds = [...setlist.items]
    .sort((a, b) => a.position - b.position)
    .map((item) => item.songId);

  return serializeSetlist(
    { ...setlist, updatedAt: updatedAt ?? setlist.updatedAt },
    songIds,
  );
}

export async function getSetlistInBandOrThrow(
  setlistId: string,
  bandId: string,
): Promise<SetlistWithItems> {
  const setlist = await prisma.setlist.findFirst({
    where: { id: setlistId, bandId },
    include: {
      items: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!setlist) {
    throw new ApiError(404, "Setlist not found");
  }

  return setlist;
}

export async function assertSongInBand(
  bandId: string,
  songId: string,
): Promise<void> {
  const song = await prisma.song.findFirst({
    where: { id: songId, bandId },
    select: { id: true },
  });

  if (!song) {
    throw new ApiError(404, "Song not found");
  }
}

function assertSameSongSet(currentSongIds: string[], nextSongIds: string[]) {
  if (currentSongIds.length !== nextSongIds.length) {
    throw new ApiError(
      400,
      "songIds must include every song currently in the setlist",
    );
  }

  if (nextSongIds.length !== new Set(nextSongIds).size) {
    throw new ApiError(400, "songIds must not contain duplicates");
  }

  const current = new Set(currentSongIds);
  for (const songId of nextSongIds) {
    if (!current.has(songId)) {
      throw new ApiError(400, `Song ${songId} is not in this setlist`);
    }
  }
}

async function applyItemPositions(
  tx: Prisma.TransactionClient,
  orderedSongIds: string[],
  items: { id: string; songId: string }[],
): Promise<void> {
  const bySongId = new Map(items.map((item) => [item.songId, item]));

  for (let index = 0; index < orderedSongIds.length; index += 1) {
    const songId = orderedSongIds[index]!;
    const item = bySongId.get(songId);
    if (!item) {
      throw new ApiError(400, `Song ${songId} is not in this setlist`);
    }

    await tx.setlistItem.update({
      where: { id: item.id },
      data: { position: POSITION_OFFSET + index },
    });
  }

  for (let index = 0; index < orderedSongIds.length; index += 1) {
    const songId = orderedSongIds[index]!;
    const item = bySongId.get(songId)!;

    await tx.setlistItem.update({
      where: { id: item.id },
      data: { position: index },
    });
  }
}

export async function touchSetlistUpdatedAt(
  tx: Prisma.TransactionClient,
  setlistId: string,
): Promise<Date> {
  const updatedAt = new Date();
  await tx.setlist.update({
    where: { id: setlistId },
    data: { updatedAt },
  });
  return updatedAt;
}

export async function removeSetlistItem(
  setlistId: string,
  bandId: string,
  songId: string,
) {
  const setlist = await getSetlistInBandOrThrow(setlistId, bandId);

  const existingItem = setlist.items.find((item) => item.songId === songId);
  if (!existingItem) {
    throw new ApiError(404, "Song is not in this setlist");
  }

  return prisma.$transaction(async (tx) => {
    await tx.setlistItem.delete({ where: { id: existingItem.id } });

    const remaining = await tx.setlistItem.findMany({
      where: { setlistId },
      orderBy: { position: "asc" },
    });

    const remainingSongIds = remaining.map((item) => item.songId);
    await applyItemPositions(tx, remainingSongIds, remaining);

    const updatedAt = await touchSetlistUpdatedAt(tx, setlistId);

    const updated = await tx.setlist.findUniqueOrThrow({
      where: { id: setlistId },
      include: { items: { orderBy: { position: "asc" } } },
    });

    return serializeSetlistRecord({ ...updated, updatedAt }, updatedAt);
  });
}

export async function addSetlistItem(
  setlistId: string,
  bandId: string,
  songId: string,
) {
  await getSetlistInBandOrThrow(setlistId, bandId);
  await assertSongInBand(bandId, songId);

  try {
    return await prisma.$transaction(async (tx) => {
      const maxPosition = await tx.setlistItem.aggregate({
        where: { setlistId },
        _max: { position: true },
      });

      const position = (maxPosition._max.position ?? -1) + 1;

      await tx.setlistItem.create({
        data: {
          id: `setlist-item-${crypto.randomUUID().slice(0, 8)}`,
          setlistId,
          songId,
          position,
        },
      });

      const updatedAt = await touchSetlistUpdatedAt(tx, setlistId);

      const updated = await tx.setlist.findUniqueOrThrow({
        where: { id: setlistId },
        include: { items: { orderBy: { position: "asc" } } },
      });

      return serializeSetlistRecord({ ...updated, updatedAt }, updatedAt);
    });
  } catch (error) {
    const mapped = mapPrismaSetlistError(error);
    if (mapped) throw mapped;
    throw error;
  }
}

export async function reorderSetlistItems(
  setlistId: string,
  bandId: string,
  songIds: string[],
) {
  const setlist = await getSetlistInBandOrThrow(setlistId, bandId);
  const currentSongIds = setlist.items.map((item) => item.songId);

  if (songIds.length === 0 && currentSongIds.length === 0) {
    return serializeSetlistRecord(setlist);
  }

  assertSameSongSet(currentSongIds, songIds);

  return prisma.$transaction(async (tx) => {
    await applyItemPositions(tx, songIds, setlist.items);
    const updatedAt = await touchSetlistUpdatedAt(tx, setlistId);

    const updated = await tx.setlist.findUniqueOrThrow({
      where: { id: setlistId },
      include: { items: { orderBy: { position: "asc" } } },
    });

    return serializeSetlistRecord({ ...updated, updatedAt }, updatedAt);
  });
}

export function mapPrismaSetlistError(error: unknown): ApiError | null {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(",")
      : String(error.meta?.target ?? "");

    if (target.includes("setlistId") && target.includes("songId")) {
      return new ApiError(409, "Song is already in this setlist");
    }

    if (target.includes("setlistId") && target.includes("position")) {
      return new ApiError(409, "Setlist item positions conflict");
    }
  }

  return null;
}
