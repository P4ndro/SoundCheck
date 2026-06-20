-- AlterTable
ALTER TABLE "User" ADD COLUMN "primaryRole" "BandRole",
ADD COLUMN "customRoleLabel" TEXT,
ADD COLUMN "profileCompletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BandInvite" (
    "id" TEXT NOT NULL,
    "bandId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BandInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BandInvite_code_key" ON "BandInvite"("code");

-- CreateIndex
CREATE INDEX "BandInvite_bandId_idx" ON "BandInvite"("bandId");

-- AddForeignKey
ALTER TABLE "BandInvite" ADD CONSTRAINT "BandInvite_bandId_fkey" FOREIGN KEY ("bandId") REFERENCES "Band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BandInvite" ADD CONSTRAINT "BandInvite_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
