import got from 'got'
import { createEmbed, useConfirmation } from '../../embeds'
import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import logger from '../../utils/logger'
import { CommandHandler } from '../types'
import { ChannelType } from 'discord.js'
import { addTrackedFaction, removeTrackedFaction } from '../../utils/redis'

type EliteBgsResponse = {
  docs: {
    _id: string
    name: string
    eddb_id: number
    allegiance: string
    faction_presence: object[]
  }[]
}

export const setupFactionHandler: CommandHandler = async ({ interaction, context: { locale } }) => {
  const { guildId } = interaction
  if (!guildId) {
    return // We should never get here as this check is done in the parent command
  }

  const factionNameInput = interaction.options.getString('name')!
  const factionShorthand = interaction.options.getString('shorthand')!
  const notificationChannel = interaction.options.getChannel<
    ChannelType.GuildText | ChannelType.GuildAnnouncement
  >('notification_channel')
  const factionNameEncoded = encodeURIComponent(factionNameInput)

  logger.info(`Setting up faction for guild ${guildId}, ${factionNameInput}, ${factionShorthand}`)

  const url = `https://elitebgs.app/api/ebgs/v5/factions?name=${factionNameEncoded}`
  const { docs } = await got(url).json<EliteBgsResponse>()

  if (!docs.length) {
    await interaction.editReply(L[locale].copilot.faction.notFound())
    return
  }

  const {
    _id: ebgsId,
    eddb_id: eddbId,
    allegiance,
    faction_presence: factionPresence,
    name: factionName,
  } = docs[0]

  try {
    void useConfirmation({
      interaction,
      locale,
      confirmation: {
        embeds: [
          createEmbed({
            title: L[locale].copilot.faction.confirm.title(),
            description: L[locale].copilot.faction.confirm.description({
              factionName,
              factionShorthand,
              allegiance,
              systemsCount: factionPresence.length,
              notificationChannel: notificationChannel?.id ?? 'None',
            }),
          }),
        ],
      },
      onConfirm: async (buttonInteraction) => {
        const existingFaction = await Prisma.faction.findFirst({
          where: { guildId },
        })

        if (existingFaction) {
          await removeTrackedFaction({ id: existingFaction.id })
        }

        const upsertedFaction = await Prisma.faction.upsert({
          where: { guildId },
          create: { guildId, ebgsId, eddbId, name: factionName, shortName: factionShorthand },
          update: { ebgsId, eddbId, name: factionName, shortName: factionShorthand },
        })

        if (notificationChannel?.id) {
          await Prisma.preferences.update({
            data: {
              factionNotificationChannelId: notificationChannel.id,
            },
            where: {
              guildId,
            },
          })

          await addTrackedFaction({ id: upsertedFaction.id, name: factionName })
        }

        await buttonInteraction.update({
          content: L[locale].copilot.faction.saved(),
          embeds: [],
          components: [],
        })
      },
      onCancel: async (buttonInteraction) => {
        await buttonInteraction.update({
          content: L[locale].copilot.faction.canceled(),
          embeds: [],
          components: [],
        })
      },
    })
  } catch {
    await interaction.editReply(L[locale].copilot.faction.notFound())
  }
}
