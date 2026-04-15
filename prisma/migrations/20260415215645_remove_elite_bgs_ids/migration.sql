/*
  Warnings:

  - You are about to drop the column `ebgsId` on the `Faction` table. All the data in the column will be lost.
  - You are about to drop the column `eddbId` on the `Faction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Faction` will be added. If there are existing duplicate values, this will fail.
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
CREATE UNIQUE INDEX "Faction_name_key" ON "Faction"("name");

-- CreateIndex
CREATE INDEX "Faction_elitehubVaultId_name_idx" ON "Faction"("elitehubVaultId", "name");
