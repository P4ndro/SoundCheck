import { prisma } from "./prisma.js";

export function serializeSong(song: {
  id: string;
  bandId: string;
  title: string;
  bpm: number | null;
  timeSignature: string;
  durationSeconds: number;
  status: string;
  key: string;
  tuning: string;
  lyrics: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: song.id,
    bandId: song.bandId,
    title: song.title,
    bpm: song.bpm,
    timeSignature: song.timeSignature,
    durationSeconds: song.durationSeconds,
    status: song.status,
    key: song.key,
    tuning: song.tuning,
    lyrics: song.lyrics,
    notes: song.notes,
    createdAt: song.createdAt.toISOString(),
    updatedAt: song.updatedAt.toISOString(),
  };
}

export function serializeUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  primaryRole?: string | null;
  customRoleLabel?: string | null;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl ?? undefined,
    primaryRole: user.primaryRole ?? undefined,
    customRoleLabel: user.customRoleLabel ?? undefined,
  };
}

export function serializeBand(band: {
  id: string;
  name: string;
  createdAt: Date;
}) {
  return {
    id: band.id,
    name: band.name,
    createdAt: band.createdAt.toISOString(),
  };
}

export function serializeMember(
  member: {
    id: string;
    userId: string;
    bandId: string;
    role: string;
    customRoleLabel: string | null;
    joinedAt: Date;
  },
  user: { id: string; name: string; email: string; avatarUrl: string | null },
) {
  return {
    id: member.id,
    userId: member.userId,
    bandId: member.bandId,
    role: member.role,
    customRoleLabel: member.customRoleLabel ?? undefined,
    joinedAt: member.joinedAt.toISOString(),
    user: serializeUser(user),
  };
}

export function serializeTab(tab: {
  id: string;
  songId: string;
  instrument: string;
  asciiTab: string;
  chordChart: string;
  capo: number | null;
  trackName: string | null;
}) {
  return {
    id: tab.id,
    songId: tab.songId,
    instrument: tab.instrument,
    asciiTab: tab.asciiTab,
    chordChart: tab.chordChart,
    capo: tab.capo,
    trackName: tab.trackName ?? undefined,
  };
}

export function serializeSetlist(
  setlist: {
    id: string;
    bandId: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
  },
  songIds: string[],
) {
  return {
    id: setlist.id,
    bandId: setlist.bandId,
    name: setlist.name,
    description: setlist.description,
    songIds,
    createdAt: setlist.createdAt.toISOString(),
    updatedAt: setlist.updatedAt.toISOString(),
  };
}

export function serializeEvent(event: {
  id: string;
  bandId: string;
  title: string;
  type: string;
  start: Date;
  end: Date;
  location: string;
  notes: string;
  setlistId: string | null;
}) {
  return {
    id: event.id,
    bandId: event.bandId,
    title: event.title,
    type: event.type,
    start: event.start.toISOString(),
    end: event.end.toISOString(),
    location: event.location,
    notes: event.notes,
    setlistId: event.setlistId ?? undefined,
  };
}

export function serializeChatMessage(message: {
  id: string;
  bandId: string;
  senderId: string;
  type: string;
  text: string | null;
  imageUrl: string | null;
  imageCaption: string | null;
  createdAt: Date;
}) {
  return {
    id: message.id,
    bandId: message.bandId,
    senderId: message.senderId,
    type: message.type,
    text: message.text ?? undefined,
    imageUrl: message.imageUrl ?? undefined,
    imageCaption: message.imageCaption ?? undefined,
    createdAt: message.createdAt.toISOString(),
  };
}

export type WorkspacePayload = {
  currentUser: ReturnType<typeof serializeUser>;
  band: ReturnType<typeof serializeBand>;
  members: ReturnType<typeof serializeMember>[];
  users: ReturnType<typeof serializeUser>[];
  songs: ReturnType<typeof serializeSong>[];
  tabs: ReturnType<typeof serializeTab>[];
  setlists: ReturnType<typeof serializeSetlist>[];
  events: ReturnType<typeof serializeEvent>[];
  chatMessages: ReturnType<typeof serializeChatMessage>[];
};

export async function loadWorkspacePayload(
  bandId: string,
  currentUserId: string,
): Promise<WorkspacePayload | null> {
  const band = await prisma.band.findUnique({ where: { id: bandId } });
  if (!band) return null;

  const [
    currentUser,
    members,
    songs,
    tabs,
    setlists,
    setlistItems,
    events,
    chatMessages,
  ] = await Promise.all([
    prisma.user.findUnique({ where: { id: currentUserId } }),
    prisma.bandMember.findMany({
      where: { bandId },
      include: { user: true },
      orderBy: { joinedAt: "asc" },
    }),
    prisma.song.findMany({
      where: { bandId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.instrumentTab.findMany({ where: { bandId } }),
    prisma.setlist.findMany({
      where: { bandId },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.setlistItem.findMany({
      where: { setlist: { bandId } },
      orderBy: { position: "asc" },
    }),
    prisma.bandEvent.findMany({
      where: { bandId },
      orderBy: { start: "asc" },
    }),
    prisma.chatMessage.findMany({
      where: { bandId },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!currentUser) return null;

  const users = members.map((member) => member.user);
  const itemsBySetlist = new Map<string, string[]>();

  for (const item of setlistItems) {
    const list = itemsBySetlist.get(item.setlistId) ?? [];
    list.push(item.songId);
    itemsBySetlist.set(item.setlistId, list);
  }

  return {
    currentUser: serializeUser(currentUser),
    band: serializeBand(band),
    members: members.map((member) => serializeMember(member, member.user)),
    users: users.map(serializeUser),
    songs: songs.map(serializeSong),
    tabs: tabs.map(serializeTab),
    setlists: setlists.map((setlist) =>
      serializeSetlist(setlist, itemsBySetlist.get(setlist.id) ?? []),
    ),
    events: events.map(serializeEvent),
    chatMessages: chatMessages.map(serializeChatMessage),
  };
}
