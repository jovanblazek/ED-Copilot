import { CacheType, CommandInteraction, Message, MessageActionRow, MessageButton } from 'discord.js'
import got from 'got'
import i18next from 'i18next'
import Keyv from 'keyv'
import Faction from '../../schemas/Faction'
import { createEmbed, refreshGuildFactionCache } from '../../utils'
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

const BUTTON_INTERACTION_TIME = 20000
const ButtonNames = {
  YES: 'yes',
  NO: 'no',
}

export const setupFactionHandler = async (
  interaction: CommandInteraction<CacheType>,
  cache: Keyv
) => {
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

  // Create confirmation embed with buttons
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
    components: [
      new MessageActionRow().addComponents(
        new MessageButton().setCustomId(ButtonNames.YES).setLabel('✔').setStyle('SUCCESS'),
        new MessageButton().setCustomId(ButtonNames.NO).setLabel('✘').setStyle('DANGER')
      ),
    ],
  })

  // Add collector
  const reply = (await interaction.fetchReply()) as Message
  const collector = reply.createMessageComponentCollector({
    componentType: 'BUTTON',
    time: BUTTON_INTERACTION_TIME,
  })

  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.user.id === interaction.user.id) {
      // If user clicked yes, create faction in DB
      if (buttonInteraction.customId === ButtonNames.YES) {
        const savedFaction = await Faction.findOneAndUpdate(
          { guildId },
          { ebgsId, eddbId, name: factionName, shorthand: factionShorthand }
        )
        if (!savedFaction) {
          await Faction.create({
            guildId,
            ebgsId,
            eddbId,
            name: factionName,
            shorthand: factionShorthand,
          })
        }
        await refreshGuildFactionCache(cache)
        await buttonInteraction.update({
          content: i18next.t('setup.faction.saved'),
          embeds: [],
          components: [],
        })
      } else {
        await buttonInteraction.update({
          content: i18next.t('setup.faction.canceled'),
          embeds: [],
          components: [],
        })
      }
    } else {
      await buttonInteraction.reply({
        content: i18next.t('error.buttonsDisabled'),
        ephemeral: true,
      })
    }
  })

  collector.on('end', async () => {
    const { embeds } = await interaction.fetchReply()
    await interaction.editReply({
      embeds,
      components: [],
    })
  })
}
