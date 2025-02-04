/*
  Warnings:

  - You are about to drop the column `guildId` on the `Faction` table. All the data in the column will be lost.
  - You are about to drop the column `shortName` on the `Faction` table. All the data in the column will be lost.
  - You are about to drop the column `factionNotificationChannelId` on the `Preferences` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Faction_guildId_eddbId_ebgsId_name_idx";

-- DropIndex
DROP INDEX "Faction_guildId_key";

-- AlterTable
ALTER TABLE "Faction" DROP COLUMN "guildId",
DROP COLUMN "shortName";

-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "factionNotificationChannelId";

-- CreateTable
CREATE TABLE "GuildFaction" (
    "id" SERIAL NOT NULL,
    "guildId" TEXT NOT NULL,
    "factionId" INTEGER NOT NULL,
    "shortName" TEXT NOT NULL,
    "notificationChannelId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuildFaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildFaction_guildId_key" ON "GuildFaction"("guildId");

-- CreateIndex
CREATE INDEX "GuildFaction_guildId_factionId_idx" ON "GuildFaction"("guildId", "factionId");

-- CreateIndex
CREATE INDEX "Faction_eddbId_ebgsId_name_idx" ON "Faction"("eddbId", "ebgsId", "name");

-- AddForeignKey
ALTER TABLE "GuildFaction" ADD CONSTRAINT "GuildFaction_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
