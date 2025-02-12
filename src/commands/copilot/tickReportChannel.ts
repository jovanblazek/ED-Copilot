import { ChannelType } from 'discord.js'
import { createEmbed, useConfirmation } from '../../embeds'
import L from '../../i18n/i18n-node'
import { Prisma } from '../../utils'
import { CommandHandler } from '../types'

export const setupTickReportChannelHandler: CommandHandler = async ({
  interaction,
  context: { locale },
}) => {
  const { guildId } = interaction
  if (!guildId) {
    return // We should never get here as this check is done in the parent command
  }

  const selectedChannel = interaction.options.getChannel('channel', false, [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
  ])

  if (selectedChannel) {
    await Prisma.guild.update({
      where: { id: guildId },
      data: { tickReportChannelId: selectedChannel.id },
    })
    await interaction.editReply(
      L[locale].copilot.tickReportChannel.saved({
        channel: `<#${selectedChannel.id}>`,
      })
    )
    return
  }

  const guild = await Prisma.guild.findFirst({
    where: { id: guildId },
    select: { tickReportChannelId: true },
  })
  const currentTickReportChannelId = guild?.tickReportChannelId

  if (!currentTickReportChannelId) {
    await interaction.editReply({
      embeds: [
        createEmbed({
          title: L[locale].copilot.tickReportChannel.title(),
          description: L[locale].copilot.tickReportChannel.descriptionNoChannel(),
        }),
      ],
    })
    return
  }

  // TODO refactor this to use only one remove button
  void useConfirmation({
    interaction,
    locale,
    confirmation: {
      embeds: [
        createEmbed({
          title: L[locale].copilot.tickReportChannel.title(),
          description: L[locale].copilot.tickReportChannel.description({
            channel: `<#${currentTickReportChannelId}>`,
          }),
        }),
      ],
    },
    onConfirm: async (buttonInteraction) => {
      await Prisma.guild.update({
        where: { id: guildId },
        data: { tickReportChannelId: null },
      })

      await buttonInteraction.update({
        content: L[locale].copilot.tickReportChannel.removed(),
        embeds: [],
        components: [],
      })
    },
    onCancel: async (buttonInteraction) => {
      await buttonInteraction.update({
        content: L[locale].copilot.tickReportChannel.notRemoved({
          channel: `<#${currentTickReportChannelId}>`,
        }),
        embeds: [],
        components: [],
      })
    },
  })
}
