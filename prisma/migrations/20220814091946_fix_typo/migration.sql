/*
  Warnings:

  - You are about to drop the column `ebbgsId` on the `Faction` table. All the data in the column will be lost.
  - Added the required column `ebgsId` to the `Faction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Faction" DROP COLUMN "ebbgsId",
ADD COLUMN     "ebgsId" TEXT NOT NULL;
