import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { clientId, guildId } from '../../config.json'
import { CommandList } from '../commands'
import logger from './logger'
import './environment'

const Rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN || '')
logger.info('Started refreshing application slash commands.')

Rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: CommandList })
  .then(() => {
    logger.info('Successfully reloaded application slash commands.')
  })
  .catch((error) => {
    logger.error('Failed to reload application slash commands.', error)
  })
