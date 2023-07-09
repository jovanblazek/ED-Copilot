import dayjs from 'dayjs'
import { SlashCommandBuilder } from 'discord.js'
import got from 'got'
import { isEmpty } from 'lodash'
import { DataParseError, SystemNotFoundError } from '../classes'
import { CommandNames } from '../constants'
import { Command } from './types'

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

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

const SystemInfo: Command = {
  builder: new SlashCommandBuilder()
    .setName(CommandNames.systemInfo)
    .setDescription('Get system BGS info')
    .addStringOption((option) =>
      option.setName('system').setDescription('System to lookup').setRequired(true)
    ),
  handler: async ({ interaction, context: { locale } }) => {
    await interaction.deferReply()

    const systemName = interaction.options.getString('system') || 'Sol'
    throw new SystemNotFoundError({ locale, systemName }) // TODO remove after tick command is implemented
    // @ts-ignore
    const systemNameWeb = encodeURIComponent(systemName)

    const url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemNameWeb}`

    const fetchedData: EdsmResponse = await got(url).json()
    if (isEmpty(fetchedData)) {
      throw new SystemNotFoundError({ locale, systemName })
    }

    const parsedData = parseSystemData(fetchedData)
    if (!parsedData) {
      throw new DataParseError({ locale })
    }

    // const localTimeZone = tick.getLocalTimeZone()

    // const embed = createEmbed({
    //   title: i18next.t('systemInfo.title', { systemName: parsedData.systemName }),
    //   description: `[INARA](https://inara.cz/starsystem/?search=${systemNameWeb})\n${DIVIDER}`,
    // }).setFooter({
    //   text: `${i18next.t('systemInfo.lastUpdate', {
    //     time: parsedData.lastUpdate.tz(localTimeZone).format('DD.MM.YYYY HH:mm'),
    //   })} ${tick.wasAfterTick(parsedData.lastUpdate) ? `✅` : `❌`}`,
    // })

    // parsedData.systemData.forEach((faction) => {
    //   embed.addField(`${faction.influence}% - ${faction.name}`, `${getStates(faction)}`, false)
    // })

    // await interaction.editReply({
    //   embeds: [embed],
    // })
  },
}

export default SystemInfo
