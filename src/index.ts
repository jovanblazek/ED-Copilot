import { REST } from '@discordjs/rest'
import { Client, Intents } from 'discord.js'
import { commandHandlers, commandList } from './commands'
import { registerCommands } from './utils'
import '../config/environment'

const { BOT_TOKEN } = process.env

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.once('ready', () => {
  console.log('Bot is ready!')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  const handler = commandHandlers[commandName]
  if (handler) {
    await commandHandlers[commandName](interaction)
  }
})

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN)
void registerCommands(rest, commandList)

void client.login(BOT_TOKEN)
