-- DropForeignKey
ALTER TABLE "FactionState" DROP CONSTRAINT "FactionState_factionId_fkey";

-- AddForeignKey
ALTER TABLE "FactionState" ADD CONSTRAINT "FactionState_factionId_fkey" FOREIGN KEY ("factionId") REFERENCES "Faction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
