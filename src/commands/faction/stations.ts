import got from 'got'
import { JSDOM } from 'jsdom'
import { chunk } from 'lodash'
import { DIVIDER, InaraUrl } from '../../constants'
import { createEmbed } from '../../embeds'
import L from '../../i18n/i18n-node'
import { getInaraStationType } from '../../utils'
import type { FactionCommandHandler } from './types'

export const scrapeInaraFactionAssets = async (factionName: string) => {
  const website = await got(InaraUrl.minorFactionAssets(factionName))
  const dom = new JSDOM(website.body)
  const tableCells = dom.window.document.querySelectorAll('td')
  if (tableCells.length === 0) {
    return []
  }
  const cellsPerRow = 8
  const rows = chunk(tableCells, cellsPerRow)

  // TODO replace all with lodash get
  const data = rows.map((row) => ({
    station: {
      type: getInaraStationType(row[0].firstChild),
      name: row[1]?.firstChild?.textContent ?? '',
      economy: row[3].textContent ?? '',
      pad: row[6].textContent ?? '',
      distanceLs: row[7].textContent ?? '',
    },
    system: row[2].textContent ?? '',
  }))
  return data
}

// TODO include note that only major stations (non odyssey) are included, this command is experimental
export const factionStationsHandler: FactionCommandHandler = async ({
  interaction,
  context: { faction, guildFaction, locale },
}) => {
  const result = await scrapeInaraFactionAssets(faction.name)
  console.log(result)
  const embed = createEmbed({
    title: L[locale].faction.stations.title({
      factionName: guildFaction.shortName,
    }),
    description: `[INARA](${InaraUrl.minorFaction(faction.name)})\n${DIVIDER}`,
  })

  await interaction.editReply({ embeds: [embed] })
}
