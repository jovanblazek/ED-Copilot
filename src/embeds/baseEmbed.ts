import { EmbedBuilder } from 'discord.js'
import { EMBED_COLOR } from '../constants'

interface CreateEmbedProps {
  title: string
  description?: string
}

export const createEmbed = ({ title, description = '' }: CreateEmbedProps) =>
  new EmbedBuilder().setColor(EMBED_COLOR).setTitle(title).setDescription(description)

// TODO upload image to CDN
// .setAuthor({
//   name: 'Copilot',
//   iconURL:
//     'https://raw.githubusercontent.com/jovanblazek/ED-Copilot/feature/typescript-overhaul/images/copilot-logo.png',
// })
