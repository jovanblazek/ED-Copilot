import { CacheType, CommandInteraction } from 'discord.js'
import got from 'got'
import i18next from 'i18next'
import { createEmbed, Prisma, useConfirmation } from '../../utils'
import logger from '../../utils/logger'

type EliteBgsResponse = {
  docs: {
    _id: string
    name: string
    eddb_id: number
    allegiance: string
    faction_presence: object[]
  }[]
}

export const setupFactionHandler = async (interaction: CommandInteraction<CacheType>) => {
  const { guildId } = interaction
  if (!guildId) {
    logger.warn('Discord guild id not found while setting up faction.')
    return
  }

  const factionNameInput = interaction.options.getString('name')!
  const factionShorthand = interaction.options.getString('shorthand')!
  const factionNameEncoded = encodeURIComponent(factionNameInput)

  logger.info(`Setting up faction for guild ${guildId}, ${factionNameInput}, ${factionShorthand}`)

  const url = `https://elitebgs.app/api/ebgs/v5/factions?name=${factionNameEncoded}`
  const { docs } = await got(url).json<EliteBgsResponse>()

  if (!docs.length) {
    await interaction.editReply(i18next.t('setup.faction.notFound'))
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
      confirmation: {
        embeds: [
          createEmbed({
            title: i18next.t('setup.faction.confirm.title'),
            description: i18next.t('setup.faction.confirm.description', {
              factionName,
              factionShorthand,
              allegiance,
              systemsCount: factionPresence.length,
            }),
          }),
        ],
      },
      onConfirm: async (buttonInteraction) => {
        await Prisma.faction.upsert({
          where: { guildId },
          create: { guildId, ebgsId, eddbId, name: factionName, shortName: factionShorthand },
          update: { ebgsId, eddbId, name: factionName, shortName: factionShorthand },
        })

        await buttonInteraction.update({
          content: i18next.t('setup.faction.saved'),
          embeds: [],
          components: [],
        })
      },
      onCancel: async (buttonInteraction) => {
        await buttonInteraction.update({
          content: i18next.t('setup.faction.canceled'),
          embeds: [],
          components: [],
        })
      },
    })
  } catch {
    await interaction.editReply(i18next.t('setup.faction.notFound'))
  }
}
