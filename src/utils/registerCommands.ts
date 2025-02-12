import { REST, Routes } from 'discord.js'
import { CommandBuilders } from '../commands'
import logger from './logger'
import './environment'

const { NODE_ENV, BOT_TOKEN, DEV_GUILD_ID, CLIENT_ID } = process.env

const Rest = new REST({ version: '10' }).setToken(BOT_TOKEN)
logger.info('Started refreshing application slash commands.')

Rest.put(
  NODE_ENV === 'production'
    ? Routes.applicationCommands(CLIENT_ID)
    : Routes.applicationGuildCommands(CLIENT_ID, DEV_GUILD_ID),
  { body: CommandBuilders }
)
  .then(() => {
    logger.info('Successfully reloaded application slash commands.')
    process.exit(0)
  })
  .catch((error) => {
    logger.error('Failed to reload application slash commands.', error)
    process.exit(1)
  })
