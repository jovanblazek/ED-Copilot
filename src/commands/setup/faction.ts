import { CacheType, CommandInteraction } from 'discord.js'
import got from 'got'
import i18next from 'i18next'
import Faction from '../../schemas/Faction'
import { createEmbed } from '../../utils'
import logger from '../../utils/logger'

type EliteBgsResponse = {
  docs: {
    _id: string
    eddb_id: number
    allegiance: string
    faction_presence: object[]
  }[]
}

export const setupFactionHandler = async (interaction: CommandInteraction<CacheType>) => {
  const discordGuildId = interaction.guildId
  if (!discordGuildId) {
    logger.warn('Discord guild id not found while setting up faction.')
    return
  }

  const factionName = interaction.options.getString('name')!
  const factionShorthand = interaction.options.getString('shorthand')!

  logger.info(`Setting up faction for guild ${discordGuildId}, ${factionName}, ${factionShorthand}`)

  const factionNameEncoded = encodeURIComponent(factionName)

  const url = `https://elitebgs.app/api/ebgs/v5/factions?name=${factionNameEncoded}`
  const { docs } = await got(url).json<EliteBgsResponse>()

  if (!docs.length) {
    await interaction.editReply(i18next.t('setup.faction.notFound'))
    return
  }

  const { _id: ebgsId, eddb_id: eddbId, allegiance, faction_presence: factionPresence } = docs[0]

  // TODO add buttons to respond
  await interaction.editReply({
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
  })

  // TODO if response is not yes, cancel setup

  const savedFaction = await Faction.findOneAndUpdate(
    { discordGuildId },
    { ebgsId, eddbId, name: factionName, shorthand: factionShorthand }
  )
  if (!savedFaction) {
    await Faction.create({
      discordGuildId,
      ebgsId,
      eddbId,
      name: factionName,
      shorthand: factionShorthand,
    })
  }
  await interaction.editReply({
    content: i18next.t('setup.faction.saved'),
    embeds: [],
  })
}
