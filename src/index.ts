import { REST } from '@discordjs/rest'
import { Client, Intents } from 'discord.js'
import { CommandHandlers, CommandList } from './commands'
import { initTranslations, registerCommands } from './utils'
import '../config/environment'

const { BOT_TOKEN } = process.env

const BotClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

BotClient.once('ready', async () => {
  await initTranslations()

  console.log('Bot is ready!')
})

BotClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  const handler = CommandHandlers[commandName]
  if (handler) {
    await CommandHandlers[commandName](interaction)
  }
})

// used for updating server slash commands
const Rest = new REST({ version: '9' }).setToken(BOT_TOKEN)
void registerCommands(Rest, CommandList)

void BotClient.login(BOT_TOKEN)
