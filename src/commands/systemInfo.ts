import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from 'dayjs'
import { CacheType, CommandInteraction } from 'discord.js'
import got from 'got'
import i18next from 'i18next'
import { isEmpty } from 'lodash'
import { CommandNames, DIVIDER } from '../constants'
import { Tick } from '../data/Tick'
import { createEmbed } from '../utils'

type FactionType = {
  name: string
  influence: number
  activeStates: {
    state: string
  }[]
  pendingStates: {
    state: string
  }[]
  lastUpdate: number
}

type EdsmResponse = {
  name: string
  factions: FactionType[]
}

const parseSystemData = (response: EdsmResponse) => {
  const { name: systemName, factions } = response
  if (!factions || !factions.length) {
    return null
  }

  const lastUpdate = dayjs.unix(factions[0].lastUpdate).utc()

  const realFactions = factions.filter(({ influence }) => influence > 0)
  const systemData = realFactions.map(({ name, influence, activeStates, pendingStates }) => ({
    name,
    influence: Math.round(influence * 1000) / 10,
    activeStates,
    pendingStates,
  }))

  return { systemName, systemData, lastUpdate }
}

const getStatesString = (array: { state: string }[]) => {
  if (!array || !array.length) {
    return ''
  }

  return array.map(({ state }) => state).join(', ')
}
const getStates = (faction: Omit<FactionType, 'lastUpdate'>) => {
  const pending = getStatesString(faction.pendingStates)
  const active = getStatesString(faction.activeStates)

  if (pending === '' && active === '') {
    return '\u200b'
  }

  let output = ''
  if (pending !== '') {
    output += `🟠 ${pending}`
  }
  if (active !== '') {
    output += `\n🟢 ${active}`
  }

  output += `\n\u200b`

  return output
}

export default {
  name: CommandNames.systemInfo,
  command: new SlashCommandBuilder()
    .setName(CommandNames.systemInfo)
    .setDescription('Get system BGS info')
    .addStringOption((option) =>
      option.setName('system').setDescription('System to lookup').setRequired(true)
    ),
  handler: async (interaction: CommandInteraction<CacheType>, SavedTick: Tick) => {
    await interaction.deferReply()
    const systemName = interaction.options.getString('system') || 'Sol'
    const systemNameWeb = encodeURIComponent(systemName)

    const url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemNameWeb}`

    const fetchedData: EdsmResponse = await got(url).json()
    if (isEmpty(fetchedData)) {
      await interaction.editReply({
        content: i18next.t('error.systemNotFound', { systemName }),
      })
      return
    }

    const parsedData = parseSystemData(fetchedData)
    if (!parsedData) {
      await interaction.editReply({
        content: i18next.t('error.parsingError'),
      })
      return
    }

    const tickTime = SavedTick.getLocalTicktime()
    if (tickTime === null) {
      await interaction.editReply({
        content: i18next.t('error.tickFetchingError'),
      })
      return
    }

    // TODO lastupdate to local tz, debug tick difference, translations, error handler
    const embed = createEmbed({
      title: `Frakcie v systéme ${parsedData.systemName}`,
      description: `[INARA](https://inara.cz/starsystem/?search=${systemNameWeb})\n${DIVIDER}`,
    }).setFooter({
      text: `Last update: ${parsedData.lastUpdate.format('DD.MM.YYYY HH:mm')} ${
        SavedTick.wasAfterTick(parsedData.lastUpdate) ? `✅` : `❌`
      }`,
    })

    parsedData.systemData.forEach((faction) => {
      embed.addField(`${faction.influence}% - ${faction.name}`, `${getStates(faction)}`, false)
    })

    await interaction.editReply({
      embeds: [embed],
    })
  },
}
