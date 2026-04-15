/*
  Warnings:

  - A unique constraint covering the columns `[elitehubVaultId]` on the table `Faction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Faction_eddbId_ebgsId_name_idx";

-- AlterTable
ALTER TABLE "Faction" ADD COLUMN     "elitehubVaultId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Faction_elitehubVaultId_key" ON "Faction"("elitehubVaultId");

-- CreateIndex
CREATE INDEX "Faction_eddbId_ebgsId_elitehubVaultId_name_idx" ON "Faction"("eddbId", "ebgsId", "elitehubVaultId", "name");
