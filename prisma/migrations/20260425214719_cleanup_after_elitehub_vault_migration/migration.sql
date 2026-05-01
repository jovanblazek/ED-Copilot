/*
  Warnings:

  - You are about to drop the column `ebgsId` on the `Faction` table. All the data in the column will be lost.
  - You are about to drop the column `eddbId` on the `Faction` table. All the data in the column will be lost.
  - Made the column `elitehubVaultId` on table `Faction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Faction_ebgsId_key";

-- DropIndex
DROP INDEX "Faction_eddbId_ebgsId_elitehubVaultId_name_idx";

-- DropIndex
DROP INDEX "Faction_eddbId_key";

-- AlterTable
ALTER TABLE "Faction" DROP COLUMN "ebgsId",
DROP COLUMN "eddbId",
ALTER COLUMN "elitehubVaultId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Faction_elitehubVaultId_name_idx" ON "Faction"("elitehubVaultId", "name");
