-- Remove duplicate instrument tabs, keeping the lowest id per song + instrument.
DELETE FROM "InstrumentTab" AS a
USING "InstrumentTab" AS b
WHERE a."songId" = b."songId"
  AND a.instrument = b.instrument
  AND a.id > b.id;

-- CreateIndex
CREATE UNIQUE INDEX "InstrumentTab_songId_instrument_key" ON "InstrumentTab"("songId", "instrument");
