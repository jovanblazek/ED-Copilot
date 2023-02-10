import { SlashCommandBuilder } from 'discord.js'
import i18next from 'i18next'
import { Command } from '../classes'
import { CommandNames } from '../constants'
import {
  addCommasToNumber,
  createEmbed,
  fetchCommanderCredits,
  InaraProfile,
  inaraRequest,
  parseInaraRanks,
  Prisma,
} from '../utils'

// TODO use image from CDN, or local image
const FALLBACK_CMDR_AVATAR_URL = 'https://inara.cz/data/users/131/131443x1830.jpg'

export default new Command(
  {
    name: CommandNames.commanderProfile,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.commanderProfile)
    .setDescription('Get your commander profile'),
  async ({ interaction }) => {
    await interaction.deferReply()

    const user = await Prisma.user.findFirst({
      where: {
        userId: interaction.user.id,
      },
    })
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
    embed.setThumbnail(inaraProfile?.avatarImageURL || FALLBACK_CMDR_AVATAR_URL)
    embed.addFields(rankEmbedFields)
    if (cmdrCredits) {
      embed.addFields([
        {
          name: 'Balance',
          value: `${addCommasToNumber(cmdrCredits.credits[0].balance)} Cr`,
          inline: true,
        },
      ])
    } else {
      embed.setFooter(i18next.t('commanderProfile.missingEdsmKey'))
    }
    // TODO rework this after adding timezone to DB
    // embed.setFooter(`Inara & EDSM - ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`)
    await interaction.editReply({
      embeds: [embed],
    })
  }
)
