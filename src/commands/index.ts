import { SlashCommandBuilder } from '@discordjs/builders'
import ping from './ping'

export const commandList = [
  ping.command,
  new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
  new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
].map((command) => command.toJSON())

export const commandHandlers = {
  ping: ping.handler,
}
