const got = require('got')
const jsdom = require('jsdom')
const moment = require('moment')
const { divider, factionNameShort, tickReportChannel } = require('../config.json')
const { getFactionInaraUrl, getFactionEddbId, getFactionId } = require('../data/Faction')
const { createEmbed, validateArgs, wasAfterTick, getTickTime } = require('../helpers')
const { displayError, tickError } = require('../helpers/error')

moment.locale('sk')
const { JSDOM } = jsdom

const addSuffixToInt = (value) => {
	const suffixes = ['', 'k', 'm', 'b', 't']
	const suffixNum = Math.floor(`${value}`.length / 3)
	let shortValue = parseFloat(
		(suffixNum !== 0 ? value / 1000 ** suffixNum : value).toPrecision(2)
	)
	if (shortValue % 1 !== 0) {
		shortValue = shortValue.toFixed(1)
	}
	return shortValue + suffixes[suffixNum]
}

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

const printTrend = (trend) => {
	if (trend < 0) return `<:arrow_red:842824890918764544> ${trend}%`
	return `<:arrow_green:842824851072614487> +${trend}%`
}

const getStationIcon = (stationTypeInt) => {
	let type
	let priority
	switch (parseInt(stationTypeInt)) {
		case 1:
		case 12:
		case 13:
			type = '<:coriolis:822765325350076426> Starport'
			priority = 1
			break
		case 3:
			type = '<:outpost:822765313870397460> Outpost'
			priority = 2
			break
		case 14:
		case 15:
			type = '<:surface:822765337548029962> Planetary port'
			priority = 3
			break
		default:
			type = '<:other:822765350536871946> Other'
			priority = 4
			break
	}
	return { type, priority }
}

const parseStationData = (rows) => {
	const data = []
	const rowsLength = rows.length
	for (let i = 0; i < rowsLength; i++) {
		const object = {}
		const links = rows[i].querySelectorAll('td a.inverse')

		object.system = links[1].textContent
		object.stationName = links[0].textContent

		const type = rows[i].querySelector('td:first-child').getAttribute('data-order')

		;({ type: object.type, priority: object.priority } = getStationIcon(type))

		data.push(object)
	}
	return data
}

const generateStationsEmbed = (data) => {
	const embed = createEmbed({
		title: `${factionNameShort} Stations`,
		description: `[INARA](${getFactionInaraUrl()})\n${divider}`,
	})

	data.forEach((outputEl) => {
		embed.addField(`${outputEl.system}`, `${divider}`)
		outputEl.stations.forEach((el) => {
			embed.addField(`${el.name}`, `${el.type}`)
		})
		embed.addField(`\u200B`, `${divider}`)
	})

	return embed
}

const parseConflictsData = (systemsPresent, tickTime) => {
	const data = []
	systemsPresent.forEach((system) => {
		if (!system.conflicts.length) return

		const object = {}
		object.faction1 = {}
		object.faction2 = {}

		const conflict = system.system_details.conflicts[0]

		object.system = system.system_name
		object.lastUpdate = moment.utc(system.updated_at)
		object.isUpdated = wasAfterTick(object.lastUpdate, tickTime)
		object.status = conflict.status

		// read from conflict - print to object
		;['name', 'stake', 'days_won'].forEach(
			(prop) => (object.faction1[prop] = conflict.faction1[prop])
		)
		;['name', 'stake', 'days_won'].forEach(
			(prop) => (object.faction2[prop] = conflict.faction2[prop])
		)
		if (conflict.faction1.faction_id === getFactionId()) object.faction1.isPlayer = true
		else object.faction2.isPlayer = true

		data.push(object)
	})
	return data
}

const printConflict = (embed, player, enemy, conflict) => {
	embed.addField(
		`${divider}`,
		`**${factionNameShort} vs ${enemy.name}**\n<:system:822765748111671326> ${conflict.system}`
	)
	if (conflict.status === 'pending') embed.addField(`\`pending\``, '\u200B', true)
	else embed.addField(`\`${player.days_won} vs ${enemy.days_won}\``, '\u200B', true)

	embed.addField(`🏆 ${enemy.stake || ' ---'}`, `💥 ${player.stake || ' ---'}`, true)
	embed.addField(
		`\u200B`,
		`${conflict.lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')} ${
			conflict.isUpdated ? `✅` : `❌`
		}`
	)
}

const generateConflictsEmbed = (data) => {
	const embed = createEmbed({
		title: `${factionNameShort} Conflicts`,
		description: `[INARA](${getFactionInaraUrl()})\n${divider}`,
	})

	if (!data.length) {
		embed.addField(`Žiadne konflikty 🎉`, '\u200B')
	} else {
		data.forEach((conflict) => {
			if (conflict.faction1.isPlayer)
				printConflict(embed, conflict.faction1, conflict.faction2, conflict)
			else printConflict(embed, conflict.faction2, conflict.faction1, conflict)
		})
	}

	return embed
}

const parseSystemsData = (systemsPresent) => {
	const data = []
	systemsPresent.forEach((system) => {
		const object = {}
		object.system = system.system_name
		object.realInfluence = system.influence
		object.influence = Math.round(system.influence * 1000) / 10
		object.lastUpdate = moment.utc(system.updated_at)

		object.population = addSuffixToInt(system.system_details.population)
		object.trend = 0
		object.isUpdated = false
		data.push(object)
	})

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

	data.forEach((el) => {
		embed.addField(
			`${el.influence.toFixed(1)}% - ${printTrend(el.trend)} - ${el.system} - 🙍‍♂️ ${
				el.population
			}`,
			` ${el.isUpdated ? `✅` : `❌`} \u200B${el.lastUpdate
				.tz('Europe/Berlin')
				.from(moment.tz('Europe/Berlin'))}`
		)
	})

	return embed
}

module.exports = {
	name: 'itrc',
	description: 'Vypíše rôzne informácie o ITRC ako napríklad stav konfliktov.',
	arguments: [
		{
			name: 'argument',
			description: 'Typ commandu, ktorý chceš zavolať',
			options: [
				{
					name: 'conflicts',
					description: 'Vypíše **konflikty** ITRC',
				},
				{
					name: 'stations',
					description: 'Vypíše **stanice** pod kontrolou ITRC',
				},
				{
					name: 'systems',
					description: 'Vypíše **systémy**, v ktorých je ITRC',
				},
			],
		},
	],
	async execute(message, args) {
		if (!validateArgs(args, message, 1, 1)) return

		if (args[0] === 'conflicts') this.conflicts(message)
		else if (args[0] === 'stations') this.stations(message)
		else if (args[0] === 'systems') this.systems(message)
		else displayError(`Neznámy argument ${args[0]}`, message)
	},
	async conflicts(message) {
		try {
			const conflictsUrl = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${getFactionEddbId()}&systemDetails=true`

			const fetchedData = await got(conflictsUrl).json()

			const tickTime = await getTickTime()
			if (tickTime == null) {
				tickError(message)
				return
			}

			const parsedData = parseConflictsData(fetchedData.docs[0].faction_presence, tickTime)
			message.channel.send({ embed: generateConflictsEmbed(parsedData) })
		} catch (error) {
			console.log(error)
		}
	},
	async stations(message) {
		try {
			const fetchedData = await got(getFactionInaraUrl())
			const dom = new JSDOM(fetchedData.body)
			const rows = dom.window.document.querySelectorAll(
				'.maincontent1 > div.maintable table tbody tr'
			)
			if (rows.length === 0) {
				message.channel.send(`Žiadne stanice`)
				return
			}

			// Save only important stations (starports, outposts, planetary ports)
			const parsedData = parseStationData(rows).filter((station) => station.priority < 4)

			// sort by system name
			parsedData.sort((a, b) => {
				const systemA = a.system.toUpperCase()
				const systemB = b.system.toUpperCase()

				if (systemA > systemB) return 1
				if (systemA < systemB) return -1

				return 0
			})

			// convert data to array of system objects with array of stations
			const result = []
			let didpush = false
			parsedData.forEach((el) => {
				didpush = false

				if (result.length) {
					result.forEach((resEl) => {
						if (resEl.system === el.system) {
							resEl.stations.push({
								name: el.stationName,
								type: el.type,
								priority: el.priority,
							})
							didpush = true
						}
					})
					if (didpush === false) {
						result.push({
							system: el.system,
							stations: [
								{
									name: el.stationName,
									type: el.type,
									priority: el.priority,
								},
							],
						})
					}
				} else {
					result.push({
						system: el.system,
						stations: [
							{
								name: el.stationName,
								type: el.type,
								priority: el.priority,
							},
						],
					})
				}
			})

			// sort by station priority
			result.forEach((el) => {
				el.stations.sort((a, b) => {
					const stationA = a.priority
					const stationB = b.priority

					if (stationA > stationB) return 1
					if (stationA < stationB) return -1

					return 0
				})
			})

			message.channel.send({ embed: generateStationsEmbed(result) })
		} catch (error) {
			console.log(error)
		}
	},
	async systems(message, client = null) {
		try {
			const systemsUrl = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${getFactionEddbId()}&systemDetails=true&count=2`
			const fetchedData = await got(systemsUrl).json()
			const parsedData = parseSystemsData(fetchedData.docs[0].faction_presence)
			calculateInfluenceTrend(parsedData, fetchedData.docs[0].history)

			const tickTime = await getTickTime()
			if (tickTime == null) {
				tickError(message)
				return
			}

			parsedData.forEach((data) => {
				data.isUpdated = wasAfterTick(data.lastUpdate, tickTime)
			})

			if (client != null)
				client.channels.cache
					.get(tickReportChannel)
					.send({ embed: generateSystemsEmbed(parsedData) })
			else message.channel.send({ embed: generateSystemsEmbed(parsedData) })
		} catch (error) {
			console.log(error)
		}
	},
}
