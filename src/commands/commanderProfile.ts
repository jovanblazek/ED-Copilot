import { SlashCommandBuilder } from 'discord.js'
import { CommandNames } from '../constants'
import { createEmbed } from '../embeds'
import L from '../i18n/i18n-node'
import type { InaraProfile } from '../types/inara'
import {
  addCommasToNumber,
  fetchCommanderCredits,
  inaraRequest,
  parseInaraRanks,
  Prisma,
} from '../utils'
import { Command } from './types'

// TODO use image from CDN, or local image
const FALLBACK_CMDR_AVATAR_URL = 'https://inara.cz/data/users/131/131443x1830.jpg'

const CommanderProfile: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.commanderProfile)
    .setDescription('Get your commander profile'),
  handler: async ({ interaction, context: { locale } }) => {
    await interaction.deferReply()

    const user = await Prisma.user.findFirst({
      where: {
        id: interaction.user.id,
      },
    })
    if (!user) {
      await interaction.editReply({
        content: L[locale].commanderProfile.notFound(),
      })
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
      await interaction.editReply({
        content: L[locale].error.general(),
      })
      return
    }
    if (inaraResponse.events[0].eventStatus === 204) {
      await interaction.editReply({
        content: L[locale].commanderProfile.notFound(),
      })
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
      .setURL(inaraProfile.inaraURL)
      .setThumbnail(inaraProfile?.avatarImageURL || FALLBACK_CMDR_AVATAR_URL)
      .addFields(rankEmbedFields)
      .setTimestamp()

    if (cmdrCredits?.credits) {
      embed
        .addFields([
          {
            name: 'Balance',
            value: `${addCommasToNumber(cmdrCredits.credits[0].balance)} Cr`,
            inline: true,
          },
        ])
        .setFooter({
          text: `Inara & EDSM`,
        })
    } else {
      embed.setFooter({
        text: `${L[locale].commanderProfile.missingEdsmKey()}\nInara`,
      })
    }

    await interaction.editReply({
      embeds: [embed],
    })
  },
}

export default CommanderProfile
