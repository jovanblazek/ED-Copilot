-- CreateEnum
CREATE TYPE "StateType" AS ENUM ('Pending', 'Active', 'Recovering');

-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "factionNotificationChannelId" TEXT;

-- CreateTable
CREATE TABLE "FactionState" (
    "id" BIGSERIAL NOT NULL,
    "factionId" INTEGER NOT NULL,
    "systemName" TEXT NOT NULL,
    "stateName" TEXT NOT NULL,
    "stateType" "StateType" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactionState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FactionState_factionId_systemName_idx" ON "FactionState"("factionId", "systemName");

-- CreateIndex
CREATE INDEX "Faction_guildId_eddbId_ebgsId_name_idx" ON "Faction"("guildId", "eddbId", "ebgsId", "name");

-- CreateIndex
CREATE INDEX "Preferences_guildId_idx" ON "Preferences"("guildId");

-- CreateIndex
CREATE INDEX "User_userId_idx" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "FactionState" ADD CONSTRAINT "FactionState_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
