import { REST, Routes } from 'discord.js'
import { clientId, guildId } from '../../config.json'
import { CommandBuilders } from '../commands'
import logger from './logger'
import './environment'

const Rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN || '')
logger.info('Started refreshing application slash commands.')

Rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: CommandBuilders })
  .then(() => {
    logger.info('Successfully reloaded application slash commands.')
  })
  .catch((error) => {
    logger.error('Failed to reload application slash commands.', error)
  })
