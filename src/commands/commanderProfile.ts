import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { Command } from '../classes'
import { CommandNames } from '../constants'
import User from '../schemas/User'
import {
  addCommasToNumber,
  createEmbed,
  fetchCommanderCredits,
  InaraProfile,
  inaraRequest,
  parseInaraRanks,
} from '../utils'

export default new Command(
  {
    name: CommandNames.commanderProfile,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.commanderProfile)
    .setDescription('Get your commander profile'),
  async ({ interaction }) => {
    await interaction.deferReply()

    const user = await User.findOne({ userId: interaction.user.id })
    if (!user) {
      await interaction.editReply(i18next.t('commanderProfile.notFound'))
      return
    }

    const inaraResponse = await inaraRequest<InaraProfile>([
      {
        eventName: 'getCommanderProfile',
        eventData: {
          searchName: user.cmdrName,
        },
      },
    ])

    if (!inaraResponse || inaraResponse.header.eventStatus !== 200) {
      await interaction.editReply(i18next.t('error.general'))
      return
    }
    if (inaraResponse.events[0].eventStatus === 204) {
      await interaction.editReply(i18next.t('commanderProfile.notFound'))
      return
    }
    const inaraProfile = inaraResponse.events[0].eventData
    const ranks = parseInaraRanks(inaraProfile.commanderRanksPilot)
    const rankEmbedFields = ranks.map((rank) => ({
      ...rank,
      inline: true,
    }))

    const cmdrCredits = await fetchCommanderCredits(user.cmdrName, user.edsmApiKey)

    const embed = createEmbed({
      title: `CMDR ${inaraProfile.userName}`,
    })
    embed.setURL(inaraProfile.inaraURL)
    embed.addFields(rankEmbedFields)
    if (cmdrCredits) {
      embed.addField('Balance', `${addCommasToNumber(cmdrCredits.credits[0].balance)} Cr`, true)
    }
    // TODO use image from CDN, or local image
    embed.setThumbnail(
      inaraProfile?.avatarImageURL || 'https://inara.cz/data/users/131/131443x1830.jpg'
    )
    // TODO rework this after adding timezone to DB
    // embed.setFooter(`Inara & EDSM - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
    await interaction.editReply({
      embeds: [embed],
    })
  }
)
