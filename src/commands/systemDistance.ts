import { SlashCommandBuilder } from 'discord.js'
import got from 'got'
import { SystemNotFoundError } from '../classes'
import { CommandNames } from '../constants'
import { createEmbed } from '../embeds'
import { toUpperCaseFirstLetter } from '../utils'
import type { Command } from './types'

type SystemData = {
  name: string
  coords: {
    x: number
    y: number
    z: number
  }
}

const getSystemCoords = async (systemName: string) => {
  const url = `https://www.edsm.net/api-v1/system?systemName=${encodeURIComponent(
    systemName
  )}&showCoordinates=1`

  const fetchedData: SystemData = await got(url).json()
  // EDSM returns [] on error (e.g. wrong system name)
  if (Array.isArray(fetchedData)) {
    return null
  }
  return fetchedData.coords
}

const SystemDistance: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.systemDistance)
    .setDescription('Get distance between two systems')
    .addStringOption((option) =>
      option.setName('from').setDescription('System #1').setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('to').setDescription('System #2').setRequired(true)
    ),
  handler: async ({ interaction, context: { locale } }) => {
    await interaction.deferReply()

    const system1 = interaction.options.getString('from')!
    const system2 = interaction.options.getString('to')!

    const coords1 = await getSystemCoords(system1)
    const coords2 = await getSystemCoords(system2)

    if (!coords1 || !coords2) {
      throw new SystemNotFoundError({ locale, systemName: !coords1 ? system1 : system2 })
    }

    const distance = Math.sqrt(
      (coords1.x - coords2.x) ** 2 + (coords1.y - coords2.y) ** 2 + (coords1.z - coords2.z) ** 2
    ).toFixed(2)

    const embed = createEmbed({
      title: `${toUpperCaseFirstLetter(
        system1
      )}  ····· ${distance} ly ·····  ${toUpperCaseFirstLetter(system2)}`,
    })

    await interaction.editReply({
      embeds: [embed],
    })
  },
}

export default SystemDistance
