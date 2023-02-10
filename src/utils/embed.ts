import { EmbedBuilder } from 'discord.js'
import { EMBED_COLOR } from '../constants'

interface ICreateEmbed {
  title: string
  description?: string
}

export const createEmbed = ({ title, description = '' }: ICreateEmbed) =>
  new EmbedBuilder().setColor(EMBED_COLOR).setTitle(title).setDescription(description)

// TODO upload image to CDN
// .setAuthor({
//   name: 'Copilot',
//   iconURL:
//     'https://raw.githubusercontent.com/jovanblazek/ED-Copilot/feature/typescript-overhaul/images/copilot-logo.png',
// })
