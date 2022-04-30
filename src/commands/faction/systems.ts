import { CacheType, CommandInteraction } from 'discord.js'
import got from 'got'
import { Faction, Tick, TickFetchError } from '../../classes'
import logger from '../../utils/logger'

// const calculateInfluenceTrend = (data, history) => {
//   const dataLength = data.length
//   const historyLength = history.length
//   for (let i = 0; i < dataLength; i++) {
//     for (let j = 0; j < historyLength; j++) {
//       if (data[i].system === history[j].system && data[i].realInfluence !== history[j].influence) {
//         // console.log('Before '+ history[j].influence+ '-- After ' +data[i].realInfluence);
//         data[i].trend = data[i].realInfluence - history[j].influence
//         data[i].trend = (Math.round(data[i].trend * 1000) / 10).toFixed(1)
//       }
//     }
//   }
// }

// const parseSystemsData = (systemsPresent) => {
//   const data = []
//   systemsPresent.forEach(
//     ({
//       system_name: systemName,
//       influence,
//       updated_at: updatedAt,
//       system_details: systemDetails,
//     }) => {
//       data.push({
//         system: systemName,
//         realInfluence: influence,
//         influence: Math.round(influence * 1000) / 10,
//         trend: 0,
//         population: addSuffixToInt(systemDetails.population),
//         lastUpdate: moment.utc(updatedAt),
//         isUpdated: false,
//       })
//     }
//   )

//   // sort by influence
//   data.sort((a, b) => {
//     if (a.influence < b.influence) {
//       return 1
//     }
//     if (a.influence > b.influence) {
//       return -1
//     }
//     return 0
//   })
//   return data
// }

export const factionSystemsHandler = async (
  interaction: CommandInteraction<CacheType>,
  tick: Tick,
  faction: Faction
) => {
  const url = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${faction.getEddbId()}&systemDetails=true&count=2`
  const fetchedData = await got(url).json()
  console.log('fetchedData', fetchedData)
  // const parsedData = parseSystemsData(fetchedData.docs[0].faction_presence)
  // calculateInfluenceTrend(parsedData, fetchedData.docs[0].history)

  const tickTime = tick.getLocalTicktime()
  if (!tickTime) {
    throw new TickFetchError()
  }

  // parsedData.forEach((data) => {
  //   data.isUpdated = wasAfterTick(data.lastUpdate, tickTime)
  // })
}
