import { prisma, withDbRetry } from "./prisma.js";

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

export function serializePublicUser(user: {
  id: string;
  name: string;
  avatarUrl: string | null;
  primaryRole?: string | null;
  customRoleLabel?: string | null;
}) {
  return {
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl ?? undefined,
    primaryRole: user.primaryRole ?? undefined,
    customRoleLabel: user.customRoleLabel ?? undefined,
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
  user: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
    primaryRole?: string | null;
    customRoleLabel?: string | null;
  },
  options?: { includeEmail?: boolean },
) {
  return {
    id: member.id,
    userId: member.userId,
    bandId: member.bandId,
    role: member.role,
    customRoleLabel: member.customRoleLabel ?? undefined,
    joinedAt: member.joinedAt.toISOString(),
    user:
      options?.includeEmail === true
        ? serializeUser(user)
        : serializePublicUser(user),
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
  users: (
    | ReturnType<typeof serializeUser>
    | ReturnType<typeof serializePublicUser>
  )[];
  songs: ReturnType<typeof serializeSong>[];
  tabs: ReturnType<typeof serializeTab>[];
  setlists: ReturnType<typeof serializeSetlist>[];
  events: ReturnType<typeof serializeEvent>[];
};

export async function loadWorkspacePayload(
  bandId: string,
  currentUserId: string,
): Promise<WorkspacePayload | null> {
  const band = await withDbRetry(() =>
    prisma.band.findUnique({
      where: { id: bandId },
      include: {
        members: {
          include: { user: true },
          orderBy: { joinedAt: "asc" },
        },
        songs: { orderBy: { updatedAt: "desc" } },
        tabs: true,
        setlists: {
          include: {
            items: { orderBy: { position: "asc" } },
          },
          orderBy: { updatedAt: "desc" },
        },
        events: { orderBy: { start: "asc" } },
      },
    }),
  );

  if (!band) return null;

  const currentMember = band.members.find(
    (member) => member.userId === currentUserId,
  );
  if (!currentMember) return null;

  const users = band.members.map((member) => member.user);

  return {
    currentUser: serializeUser(currentMember.user),
    band: serializeBand(band),
    members: band.members.map((member) =>
      serializeMember(member, member.user, {
        includeEmail: member.userId === currentUserId,
      }),
    ),
    users: users.map((user) =>
      user.id === currentUserId
        ? serializeUser(user)
        : serializePublicUser(user),
    ),
    songs: band.songs.map(serializeSong),
    tabs: band.tabs.map(serializeTab),
    setlists: band.setlists.map((setlist) =>
      serializeSetlist(
        setlist,
        setlist.items.map((item) => item.songId),
      ),
    ),
    events: band.events.map(serializeEvent),
  };
}
