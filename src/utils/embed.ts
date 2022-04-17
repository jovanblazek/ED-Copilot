import { MessageEmbed } from 'discord.js'
import { EMBED_COLOR } from '../constants'

interface ICreateEmbed {
  title: string
  description?: string
}

export const createEmbed = ({ title, description = '' }: ICreateEmbed) =>
  new MessageEmbed().setColor(EMBED_COLOR).setTitle(title).setDescription(description)
