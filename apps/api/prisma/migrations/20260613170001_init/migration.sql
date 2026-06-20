-- CreateEnum
CREATE TYPE "SongStatus" AS ENUM ('not_started', 'in_progress', 'instrumental_ready', 'completed');

-- CreateEnum
CREATE TYPE "BandRole" AS ENUM ('bass', 'drums', 'vocals', 'lead_guitar', 'rhythm_guitar', 'custom');

-- CreateEnum
CREATE TYPE "Instrument" AS ENUM ('bass', 'drums', 'vocals', 'lead_guitar', 'rhythm_guitar');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('rehearsal', 'gig', 'meeting');

-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('text', 'image');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Band" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BandMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "role" "BandRole" NOT NULL,
    "customRoleLabel" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BandMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bpm" INTEGER,
    "timeSignature" TEXT NOT NULL DEFAULT '4/4',
    "durationSeconds" INTEGER NOT NULL DEFAULT 0,
    "status" "SongStatus" NOT NULL DEFAULT 'not_started',
    "key" TEXT NOT NULL DEFAULT '',
    "tuning" TEXT NOT NULL DEFAULT '',
    "lyrics" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstrumentTab" (
    "id" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "instrument" "Instrument" NOT NULL,
    "asciiTab" TEXT NOT NULL DEFAULT '',
    "chordChart" TEXT NOT NULL DEFAULT '',
    "capo" INTEGER,
    "trackName" TEXT,

    CONSTRAINT "InstrumentTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setlist" (
    "id" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetlistItem" (
    "id" TEXT NOT NULL,
    "setlistId" TEXT NOT NULL,
    "songId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "SetlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BandEvent" (
    "id" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "setlistId" TEXT,

    CONSTRAINT "BandEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMessage" (
    "id" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "type" "ChatMessageType" NOT NULL,
    "text" TEXT,
    "imageUrl" TEXT,
    "imageCaption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "BandMember_bandId_idx" ON "BandMember"("bandId");

-- CreateIndex
CREATE UNIQUE INDEX "BandMember_userId_bandId_key" ON "BandMember"("userId", "bandId");

-- CreateIndex
CREATE INDEX "Song_bandId_idx" ON "Song"("bandId");

-- CreateIndex
CREATE INDEX "Song_bandId_status_idx" ON "Song"("bandId", "status");

-- CreateIndex
CREATE INDEX "InstrumentTab_songId_idx" ON "InstrumentTab"("songId");

-- CreateIndex
CREATE INDEX "InstrumentTab_bandId_instrument_idx" ON "InstrumentTab"("bandId", "instrument");

-- CreateIndex
CREATE INDEX "Setlist_bandId_idx" ON "Setlist"("bandId");

-- CreateIndex
CREATE INDEX "SetlistItem_setlistId_idx" ON "SetlistItem"("setlistId");

-- CreateIndex
CREATE UNIQUE INDEX "SetlistItem_setlistId_songId_key" ON "SetlistItem"("setlistId", "songId");

-- CreateIndex
CREATE UNIQUE INDEX "SetlistItem_setlistId_position_key" ON "SetlistItem"("setlistId", "position");

-- CreateIndex
CREATE INDEX "BandEvent_bandId_idx" ON "BandEvent"("bandId");

-- CreateIndex
CREATE INDEX "BandEvent_bandId_start_idx" ON "BandEvent"("bandId", "start");

-- CreateIndex
CREATE INDEX "ChatMessage_bandId_createdAt_idx" ON "ChatMessage"("bandId", "createdAt");

-- AddForeignKey
ALTER TABLE "BandMember" ADD CONSTRAINT "BandMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandMember" ADD CONSTRAINT "BandMember_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrumentTab" ADD CONSTRAINT "InstrumentTab_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstrumentTab" ADD CONSTRAINT "InstrumentTab_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Setlist" ADD CONSTRAINT "Setlist_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetlistItem" ADD CONSTRAINT "SetlistItem_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SetlistItem" ADD CONSTRAINT "SetlistItem_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandEvent" ADD CONSTRAINT "BandEvent_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandEvent" ADD CONSTRAINT "BandEvent_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
