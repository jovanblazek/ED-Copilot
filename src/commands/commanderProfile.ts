import { SlashCommandBuilder } from '@discordjs/builders'
import i18next from 'i18next'
import { Command } from '../classes'
import { CommandNames } from '../constants'
import User from '../schemas/User'
import logger from '../utils/logger'

export default new Command(
  {
    name: CommandNames.commanderProfile,
  },
  new SlashCommandBuilder()
    .setName(CommandNames.commanderProfile)
    .setDescription('Get your commander profile'),
  async ({ interaction }) => {
    await interaction.deferReply()
    const foundUser = await User.findOne({ userId: interaction.user.id })
    if (foundUser) {
      logger.debug(foundUser.userId)
    } else {
      await interaction.editReply(
        i18next.t('commanderProfile.notFound', { user: interaction.user.username })
      )
    }
  }
)
