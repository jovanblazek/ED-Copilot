const got = require('got')
const moment = require('moment')
const { divider, factionNameShort, tickReportChannel } = require('../../config.json')
const { getFactionInaraUrl, getFactionEddbId } = require('../../data/Faction')
const {
	createEmbed,
	wasAfterTick,
	fetchTickTime,
	tickError,
	addSuffixToInt,
	printTrend,
} = require('../../utils')

const calculateInfluenceTrend = (data, history) => {
	const dataLength = data.length
	const historyLength = history.length
	for (let i = 0; i < dataLength; i++) {
		for (let j = 0; j < historyLength; j++) {
			if (
				data[i].system === history[j].system &&
				data[i].realInfluence !== history[j].influence
			) {
				// console.log('Before '+ history[j].influence+ '-- After ' +data[i].realInfluence);
				data[i].trend = data[i].realInfluence - history[j].influence
				data[i].trend = (Math.round(data[i].trend * 1000) / 10).toFixed(1)
			}
		}
	}
}

const parseSystemsData = (systemsPresent) => {
	const data = []
	systemsPresent.forEach(
		({
			system_name: systemName,
			influence,
			updated_at: updatedAt,
			system_details: systemDetails,
		}) => {
			data.push({
				system: systemName,
				realInfluence: influence,
				influence: Math.round(influence * 1000) / 10,
				trend: 0,
				population: addSuffixToInt(systemDetails.population),
				lastUpdate: moment.utc(updatedAt),
				isUpdated: false,
			})
		}
	)

	// sort by influence
	data.sort((a, b) => {
		if (a.influence < b.influence) return 1
		if (a.influence > b.influence) return -1
		return 0
	})
	return data
}

const generateSystemsEmbed = (data) => {
	const embed = createEmbed({
		title: `${factionNameShort} Systems`,
		description: `[INARA](${getFactionInaraUrl()})\n${divider}`,
	})

	data.forEach(({ system, influence, trend, population, isUpdated, lastUpdate }) => {
		embed.addField(
			`${influence.toFixed(1)}% - ${printTrend(trend)} - ${system} - 🙍‍♂️ ${population}`,
			` ${isUpdated ? `✅` : `❌`} \u200B${lastUpdate
				.tz('Europe/Berlin')
				.from(moment.tz('Europe/Berlin'))}`
		)
	})

	return embed
}

module.exports = {
	async getFactionSystemsInfo(message, client = null) {
		try {
			const systemsUrl = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${getFactionEddbId()}&systemDetails=true&count=2`
			const fetchedData = await got(systemsUrl).json()
			const parsedData = parseSystemsData(fetchedData.docs[0].faction_presence)
			calculateInfluenceTrend(parsedData, fetchedData.docs[0].history)

			const tickTime = await fetchTickTime()
			if (tickTime === null) {
				tickError(message)
			}

			parsedData.forEach((data) => {
				data.isUpdated = wasAfterTick(data.lastUpdate, tickTime)
			})

			if (client !== null)
				client.channels.cache
					.get(tickReportChannel)
					.send({ embed: generateSystemsEmbed(parsedData) })
			else message.channel.send({ embed: generateSystemsEmbed(parsedData) })
		} catch (error) {
			console.log(error)
		}
	},
}
