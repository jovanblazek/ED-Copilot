import { REST } from '@discordjs/rest'
import { Client, Intents } from 'discord.js'
import { timezone } from '../config.json'
import { CommandHandlers, CommandList } from './commands'
import { DataParseError, SystemNotFoundError, TickFetchError } from './data'
import { Tick } from './data/Tick'
import { fetchTickTime, initTranslations, registerCommands } from './utils'
import tickDetector from './utils/tickDetector'
import './utils/environment'

const { BOT_TOKEN } = process.env

const BotClient = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })
const SavedTick = new Tick(null, timezone)

BotClient.once('ready', async () => {
  await fetchTickTime().then((tickTime) => {
    if (tickTime) {
      SavedTick.setTicktime(tickTime)
    }
  })
  await initTranslations()
  tickDetector(BotClient, SavedTick)

  console.log('Bot is ready!')
})

BotClient.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  const handler = CommandHandlers[commandName]
  try {
    if (handler) {
      await CommandHandlers[commandName](interaction, SavedTick)
    }
  } catch (error) {
    console.log(error)

    if (error instanceof SystemNotFoundError) {
      await interaction.editReply({
        content: error.message,
      })
    } else if (error instanceof DataParseError) {
      await interaction.editReply({
        content: error.message,
      })
    } else if (error instanceof TickFetchError) {
      await interaction.editReply({
        content: error.message,
      })
    }
  }
})

// used for updating server slash commands
const Rest = new REST({ version: '9' }).setToken(BOT_TOKEN)
void registerCommands(Rest, CommandList)

void BotClient.login(BOT_TOKEN)
