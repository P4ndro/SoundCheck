import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(rootDir, "../.env") });

const prisma = new PrismaClient();

const BAND_ID = "band-marlowe";

const users = [
  {
    id: "user-alex",
    email: "alex@example.com",
    name: "Alex Mercer",
    primaryRole: "bass" as const,
  },
  {
    id: "user-jamie",
    email: "jamie@example.com",
    name: "Jamie Cole",
    primaryRole: "drums" as const,
  },
  {
    id: "user-sam",
    email: "sam@example.com",
    name: "Sam Rivera",
    primaryRole: "vocals" as const,
  },
  {
    id: "user-riley",
    email: "riley@example.com",
    name: "Riley Park",
    primaryRole: "lead_guitar" as const,
  },
] as const;

const songs = [
  {
    id: "song-1",
    title: "Neon Cathedral",
    bpm: 128,
    timeSignature: "4/4",
    durationSeconds: 245,
    status: "in_progress" as const,
    key: "Am",
    tuning: "E A D G",
    lyrics:
      "Flicker in the neon cathedral\nWe built our ghosts from borrowed light\nEvery echo tells a story\nEvery shadow knows the night",
    notes: "Bridge needs tighter stops. Watch the tempo drop at bar 17.",
    createdAt: "2025-11-01T10:00:00.000Z",
    updatedAt: "2026-05-28T14:30:00.000Z",
  },
  {
    id: "song-2",
    title: "Slow Burn",
    bpm: 92,
    timeSignature: "3/4",
    durationSeconds: 312,
    status: "not_started" as const,
    key: "",
    tuning: "",
    lyrics:
      "Take your time with me\nLet the embers breathe\nNothing here is urgent\nExcept the way you leave",
    notes: "Sam wants to try a lower key for the chorus.",
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "song-3",
    title: "Velvet Static",
    bpm: 110,
    timeSignature: "4/4",
    durationSeconds: 198,
    status: "completed" as const,
    key: "C",
    tuning: "E A D G",
    lyrics:
      "Velvet static on the radio\nTuning out the world below\nHold the feedback like a secret\nOnly we were meant to know",
    notes: "Performance-ready. Setlist staple.",
    createdAt: "2025-08-20T10:00:00.000Z",
    updatedAt: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "song-4",
    title: "Midnight Relay",
    bpm: 140,
    timeSignature: "4/4",
    durationSeconds: 220,
    status: "instrumental_ready" as const,
    key: "Em",
    tuning: "E A D G",
    lyrics:
      "Run the midnight relay\nPass the signal down the line\nCity lights like Morse code\nYou're the pulse and you're the sign",
    notes: "Instrumental sections locked. Vocals still being refined.",
    createdAt: "2025-12-05T10:00:00.000Z",
    updatedAt: "2026-05-20T11:00:00.000Z",
  },
  {
    id: "song-5",
    title: "Hollow Frequency",
    bpm: 118,
    timeSignature: "6/8",
    durationSeconds: 267,
    status: "in_progress" as const,
    key: "Dm",
    tuning: "E A D G",
    lyrics:
      "Tuned to a hollow frequency\nStatic where your voice should be\nI keep calling through the feedback\nBut the line won't answer me",
    notes: "Bass groove is set. Riley working on second guitar layer.",
    createdAt: "2026-02-18T10:00:00.000Z",
    updatedAt: "2026-05-30T16:45:00.000Z",
  },
  {
    id: "song-6",
    title: "Glass Harbour",
    bpm: 85,
    timeSignature: "3/4",
    durationSeconds: 340,
    status: "not_started" as const,
    key: "",
    tuning: "",
    lyrics:
      "Meet me at the glass harbour\nWhere the tide forgets the shore\nEvery vessel leaves a whisper\nEvery whisper asks for more",
    notes: "Ballad — save for encore slot.",
    createdAt: "2026-03-22T10:00:00.000Z",
    updatedAt: "2026-03-22T10:00:00.000Z",
  },
  {
    id: "song-7",
    title: "Iron Violet",
    bpm: 132,
    timeSignature: "4/4",
    durationSeconds: 186,
    status: "completed" as const,
    key: "E minor",
    tuning: "E A D G B E",
    lyrics:
      "Iron violet in the rain\nForged and bent but not undone\nStrike the anvil with conviction\nRise again into the sun",
    notes: "High energy opener. Confirmed for Friday gig.",
    createdAt: "2025-07-11T10:00:00.000Z",
    updatedAt: "2026-05-15T08:00:00.000Z",
  },
  {
    id: "song-8",
    title: "Paper Lanterns",
    bpm: 96,
    timeSignature: "6/8",
    durationSeconds: 255,
    status: "instrumental_ready" as const,
    key: "Am",
    tuning: "",
    lyrics:
      "Paper lanterns in the courtyard\nFloating up in borrowed flame\nEvery wish we never whispered\nFinds a light and finds a name",
    notes: "Great for rehearsal warm-up. Full band arrangement done.",
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-05-25T13:20:00.000Z",
  },
];

const tabs = [
  {
    id: "tab-1",
    songId: "song-1",
    instrument: "bass" as const,
    asciiTab: "Intro\nG|----------------|\nD|----7---7---7---|",
    chordChart: "Intro: Am\nVerse: Am  F  C  G\nChorus: F  G  Am  C",
  },
  {
    id: "tab-2",
    songId: "song-1",
    instrument: "drums" as const,
    asciiTab: "Intro\n|----x-x-x-x-----|",
    chordChart: "Intro: 8 bars\nVerse: backbeat\nChorus: open hats",
  },
  {
    id: "tab-3",
    songId: "song-3",
    instrument: "bass" as const,
    asciiTab: "Verse\nG|----------------|\nD|----5---5---5---|",
    chordChart: "Intro: C\nVerse: C  Am  F  G\nChorus: F  G  Am  C",
  },
  {
    id: "tab-4",
    songId: "song-4",
    instrument: "bass" as const,
    asciiTab: "Chorus\nG|----------------|\nD|----7---7---7---|",
    chordChart: "Intro: Em  D  C  D\nChorus: G  D  Em  C",
  },
  {
    id: "tab-7",
    songId: "song-7",
    instrument: "lead_guitar" as const,
    trackName: "Lead · distortion",
    capo: 2,
    asciiTab: "Solo\nE|----12b14--12--|",
    chordChart: "Intro: E minor pentatonic riff\nChorus: E5  D5  C5  B5",
  },
];

const setlists = [
  {
    id: "setlist-1",
    name: "Friday Gig",
    description: "Main set for The Velvet Room — 45 min slot.",
    songIds: ["song-7", "song-3", "song-1", "song-4", "song-8"],
    createdAt: "2026-05-10T10:00:00.000Z",
    updatedAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "setlist-2",
    name: "Sunday Rehearsal",
    description: "Focus on new material and transitions.",
    songIds: ["song-1", "song-5", "song-2", "song-6"],
    createdAt: "2026-05-18T10:00:00.000Z",
    updatedAt: "2026-05-27T10:00:00.000Z",
  },
];

const events = [
  {
    id: "event-1",
    title: "Friday Gig — The Velvet Room",
    type: "gig" as const,
    start: "2026-06-13T19:00:00.000Z",
    end: "2026-06-13T22:00:00.000Z",
    location: "The Velvet Room, 42 Bridge Street",
    notes: "Load-in at 6 PM. Backline provided. Bring own bass cab.",
    setlistId: "setlist-1",
  },
  {
    id: "event-2",
    title: "Sunday Rehearsal",
    type: "rehearsal" as const,
    start: "2026-06-08T14:00:00.000Z",
    end: "2026-06-08T17:00:00.000Z",
    location: "Studio B, Riverside Arts",
    notes: "Run Friday set first, then new songs.",
    setlistId: "setlist-2",
  },
  {
    id: "event-3",
    title: "Band Meeting — Summer Schedule",
    type: "meeting" as const,
    start: "2026-06-15T18:30:00.000Z",
    end: "2026-06-15T19:30:00.000Z",
    location: "Riverside Café",
    notes: "Discuss July bookings and merch.",
    setlistId: null,
  },
  {
    id: "event-4",
    title: "Outdoor Festival Set",
    type: "gig" as const,
    start: "2026-07-04T16:00:00.000Z",
    end: "2026-07-04T17:00:00.000Z",
    location: "Harbour Park Main Stage",
    notes: "30-minute slot. Tentative setlist TBD.",
    setlistId: null,
  },
];

const chatMessages = [
  {
    id: "msg-1",
    senderId: "user-jamie",
    type: "text" as const,
    text: "Running about 10 late — traffic on the bridge 🙃",
    createdAt: "2026-06-08T13:42:00.000Z",
  },
  {
    id: "msg-2",
    senderId: "user-sam",
    type: "text" as const,
    text: "All good, we're still setting up mics",
    createdAt: "2026-06-08T13:44:00.000Z",
  },
  {
    id: "msg-4",
    senderId: "user-alex",
    type: "text" as const,
    text: "Love putting Neon Cathedral second — crowd needs that energy early",
    createdAt: "2026-06-08T13:53:00.000Z",
  },
  {
    id: "msg-10",
    senderId: "user-sam",
    type: "text" as const,
    text: "Reminder: load-in Friday is 6 PM sharp. Don't forget the DI box.",
    createdAt: "2026-06-08T15:18:00.000Z",
  },
];

async function main() {
  console.log("Seeding Soundcheck database…");

  await prisma.chatMessage.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.setlistItem.deleteMany({ where: { setlist: { bandId: BAND_ID } } });
  await prisma.bandEvent.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.instrumentTab.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.song.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.setlist.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.bandMember.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.bandInvite.deleteMany({ where: { bandId: BAND_ID } });
  await prisma.band.deleteMany({ where: { id: BAND_ID } });
  await prisma.user.deleteMany({
    where: { id: { in: users.map((user) => user.id) } },
  });

  for (const user of users) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        primaryRole: user.primaryRole,
        profileCompletedAt: new Date("2025-09-14T10:00:00.000Z"),
      },
    });
  }

  await prisma.band.create({
    data: {
      id: BAND_ID,
      name: "The Marlowe",
      createdAt: new Date("2025-09-14T10:00:00.000Z"),
    },
  });

  const members = [
    { id: "member-1", userId: "user-alex", role: "bass" as const },
    { id: "member-2", userId: "user-jamie", role: "drums" as const },
    { id: "member-3", userId: "user-sam", role: "vocals" as const },
    { id: "member-4", userId: "user-riley", role: "lead_guitar" as const },
  ];

  for (const member of members) {
    await prisma.bandMember.create({
      data: {
        id: member.id,
        userId: member.userId,
        bandId: BAND_ID,
        role: member.role,
        joinedAt: new Date("2025-09-14T10:00:00.000Z"),
      },
    });
  }

  await prisma.bandInvite.create({
    data: {
      id: "invite-marlowe",
      bandId: BAND_ID,
      code: "MARLOWE-DEMO",
      createdBy: "user-alex",
    },
  });

  for (const song of songs) {
    await prisma.song.create({
      data: {
        ...song,
        bandId: BAND_ID,
        createdAt: new Date(song.createdAt),
        updatedAt: new Date(song.updatedAt),
      },
    });
  }

  for (const tab of tabs) {
    await prisma.instrumentTab.create({
      data: {
        id: tab.id,
        songId: tab.songId,
        bandId: BAND_ID,
        instrument: tab.instrument,
        asciiTab: tab.asciiTab,
        chordChart: tab.chordChart,
        capo: "capo" in tab ? tab.capo : null,
        trackName: "trackName" in tab ? tab.trackName : null,
      },
    });
  }

  for (const setlist of setlists) {
    await prisma.setlist.create({
      data: {
        id: setlist.id,
        bandId: BAND_ID,
        name: setlist.name,
        description: setlist.description,
        createdAt: new Date(setlist.createdAt),
        updatedAt: new Date(setlist.updatedAt),
        items: {
          create: setlist.songIds.map((songId, index) => ({
            id: `${setlist.id}-item-${index}`,
            songId,
            position: index,
          })),
        },
      },
    });
  }

  for (const event of events) {
    await prisma.bandEvent.create({
      data: {
        id: event.id,
        bandId: BAND_ID,
        title: event.title,
        type: event.type,
        start: new Date(event.start),
        end: new Date(event.end),
        location: event.location,
        notes: event.notes,
        setlistId: event.setlistId,
      },
    });
  }

  for (const message of chatMessages) {
    await prisma.chatMessage.create({
      data: {
        id: message.id,
        bandId: BAND_ID,
        senderId: message.senderId,
        type: message.type,
        text: message.text,
        createdAt: new Date(message.createdAt),
      },
    });
  }

  console.log("Seed complete.");
  console.log("Demo band:", BAND_ID);
  console.log("Demo invite code: MARLOWE-DEMO");
  console.log(
    "Link your Clerk account by signing in with alex@example.com (or any seeded member email).",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
