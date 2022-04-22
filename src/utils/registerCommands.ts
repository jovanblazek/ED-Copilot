import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import { clientId, guildId } from '../../config.json'
import { CommandList } from '../commands'
import './environment'

const Rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN || '')
console.log('Started refreshing application (/) commands.')

Rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: CommandList })
  .then(() => {
    console.log('Successfully reloaded application (/) commands.')
  })
  .catch((error) => {
    console.error(error)
  })
