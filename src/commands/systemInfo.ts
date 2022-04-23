import { SlashCommandBuilder } from '@discordjs/builders'
import dayjs from 'dayjs'
import { CacheType, CommandInteraction } from 'discord.js'
import got from 'got'
import i18next from 'i18next'
import { isEmpty } from 'lodash'
import { DataParseError, SystemNotFoundError, Tick } from '../classes'
import { CommandNames, DIVIDER } from '../constants'
import { createEmbed } from '../utils'

type Faction = {
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
  factions: Faction[]
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

const getStates = (faction: Omit<Faction, 'lastUpdate'>) => {
  const pendingStates = faction.pendingStates.map(({ state }) => state).join(', ')
  const activeStates = faction.activeStates.map(({ state }) => state).join(', ')

  if (pendingStates === '' && activeStates === '') {
    return '\u200b'
  }

  let output = ''
  if (pendingStates !== '') {
    output += `🟠 ${pendingStates}`
  }
  if (activeStates !== '') {
    output += `\n🟢 ${activeStates}`
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
      throw new SystemNotFoundError(systemName)
    }

    const parsedData = parseSystemData(fetchedData)
    if (!parsedData) {
      throw new DataParseError()
    }

    const localTimeZone = SavedTick.getLocalTimeZone()

    const embed = createEmbed({
      title: i18next.t('systemInfo.title', { systemName: parsedData.systemName }),
      description: `[INARA](https://inara.cz/starsystem/?search=${systemNameWeb})\n${DIVIDER}`,
    }).setFooter({
      text: `${i18next.t('systemInfo.lastUpdate', {
        time: parsedData.lastUpdate.tz(localTimeZone).format('DD.MM.YYYY HH:mm'),
      })} ${SavedTick.wasAfterTick(parsedData.lastUpdate) ? `✅` : `❌`}`,
    })

    parsedData.systemData.forEach((faction) => {
      embed.addField(`${faction.influence}% - ${faction.name}`, `${getStates(faction)}`, false)
    })

    await interaction.editReply({
      embeds: [embed],
    })
  },
}
