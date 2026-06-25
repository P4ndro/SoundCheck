import { prisma } from "./prisma.js";
import {
  serializeMember,
  serializePublicUser,
  serializeUser,
} from "./serializers.js";
import { ApiError } from "../middleware/error-handler.js";
import type { BandRole } from "@prisma/client";

const STANDARD_INSTRUMENT_ROLES = new Set<BandRole>([
  "bass",
  "drums",
  "vocals",
  "lead_guitar",
  "rhythm_guitar",
]);

export async function getMemberInBandOrThrow(bandId: string, userId: string) {
  const member = await prisma.bandMember.findUnique({
    where: {
      userId_bandId: {
        userId,
        bandId,
      },
    },
    include: { user: true },
  });

  if (!member) {
    throw new ApiError(404, "Member not found");
  }

  return member;
}

export async function loadMemberProfile(
  bandId: string,
  userId: string,
  viewerUserId: string,
) {
  const member = await getMemberInBandOrThrow(bandId, userId);
  const isSelf = viewerUserId === userId;

  const parts = STANDARD_INSTRUMENT_ROLES.has(member.role)
    ? await prisma.instrumentTab.findMany({
        where: {
          bandId,
          instrument: member.role as Exclude<typeof member.role, "custom">,
        },
        include: {
          song: {
            select: { id: true, title: true },
          },
        },
        orderBy: { song: { title: "asc" } },
      })
    : [];

  return {
    member: serializeMember(member, member.user, {
      includeEmail: isSelf,
    }),
    user: isSelf
      ? serializeUser(member.user)
      : serializePublicUser(member.user),
    isSelf,
    parts: parts.map((tab) => ({
      tabId: tab.id,
      songId: tab.songId,
      songTitle: tab.song.title,
      instrument: tab.instrument,
    })),
  };
}
