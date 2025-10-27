-- CreateTable
CREATE TABLE "FleetCarrier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetCarrier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FleetCarrierJump" (
    "id" SERIAL NOT NULL,
    "fleetCarrierId" INTEGER NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "guildId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FleetCarrierJump_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FleetCarrier_userId_key" ON "FleetCarrier"("userId");

-- CreateIndex
CREATE INDEX "FleetCarrier_name_idx" ON "FleetCarrier"("name");

-- CreateIndex
CREATE INDEX "FleetCarrierJump_fleetCarrierId_idx" ON "FleetCarrierJump"("fleetCarrierId");

-- AddForeignKey
ALTER TABLE "FleetCarrier" ADD CONSTRAINT "FleetCarrier_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetCarrierJump" ADD CONSTRAINT "FleetCarrierJump_fleetCarrierId_fkey" FOREIGN KEY ("fleetCarrierId") REFERENCES "FleetCarrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FleetCarrierJump" ADD CONSTRAINT "FleetCarrierJump_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE CASCADE ON UPDATE CASCADE;
