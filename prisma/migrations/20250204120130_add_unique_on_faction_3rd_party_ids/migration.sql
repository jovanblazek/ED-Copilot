/*
  Warnings:

  - A unique constraint covering the columns `[ebgsId]` on the table `Faction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eddbId]` on the table `Faction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Faction_ebgsId_key" ON "Faction"("ebgsId");

-- CreateIndex
CREATE UNIQUE INDEX "Faction_eddbId_key" ON "Faction"("eddbId");
