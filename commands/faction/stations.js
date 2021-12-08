const got = require('got')
const { JSDOM } = require('jsdom')
const { divider, factionNameShort } = require('../../config.json')
const { getFactionInaraUrl } = require('../../data/Faction')
const { createEmbed, getStationIcon } = require('../../utils')

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

	data.forEach(({ system, stations }) => {
		embed.addField(`${system}`, `${divider}`)
		stations.forEach(({ name, type }) => {
			embed.addField(`${name}`, `${type}`)
		})
		embed.addField(`\u200B`, `${divider}`)
	})

	return embed
}

module.exports = {
	async getFactionStations(message) {
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
}
