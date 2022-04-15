import { SlashCommandBuilder } from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Client, Intents } from 'discord.js'
import { Routes } from 'discord-api-types/v9'
import { clientId, guildId } from '../config/config.json'
// import { Ping } from './commands/ping'
import '../config/environment'

const { BOT_TOKEN } = process.env

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
  new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
  new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map((command) => command.toJSON())

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] })

client.once('ready', () => {
  console.log('Ready!')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) {
    return
  }

  const { commandName } = interaction

  if (commandName === 'ping') {
    await interaction.reply('Pong!')
  } else if (commandName === 'server') {
    await interaction.reply('Server info.')
  } else if (commandName === 'user') {
    await interaction.reply('User info.')
  }
})

const rest = new REST({ version: '9' }).setToken(BOT_TOKEN)

const registerCommands = async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

void client.login(BOT_TOKEN)
void registerCommands()
