const got = require('got')
const Discord = require('discord.js')
const moment = require('moment')
const { divider, embedColor } = require('../config.json')
const { systemError, tickError, displayError } = require('../helpers/error')
const { parseSystemName } = require('../helpers/systemName')
const { wasAfterTick, getTickTime } = require('../helpers/tick')
const { validateArgs } = require('../helpers/arguments')

moment.locale('sk')

const processFetchedData = (response) => {
	const { factions } = response
	if (factions == null || factions.length === 0) return null

	const systemData = []
	const lastUpdate = moment.unix(factions[0].lastUpdate).utc()

	factions.forEach((faction) => {
		if (faction.influence * 100 > 0) {
			const object = {}
			object.name = faction.name
			object.influence = Math.round(faction.influence * 1000) / 10
			object.activeStates = faction.activeStates
			object.pendingStates = faction.pendingStates
			systemData.push(object)
		}
	})

	return { systemData, lastUpdate }
}

const reduceStatesArray = (array) => {
	return array.reduce((accumulator, currentValue, currentIndex, currentArray) => {
		accumulator += currentValue.state
		if (currentIndex < currentArray.length - 1) {
			accumulator += ', '
		}
		return accumulator
	}, '')
}

const getStates = (faction) => {
	const pending = reduceStatesArray(faction.pendingStates)
	const active = reduceStatesArray(faction.activeStates)

	if (pending === '' && active === '') return '\u200b'

	let output = ''
	if (pending !== '') output += `🟠 ${pending}`
	if (active !== '') output += `\n🟢 ${active}`

	return (output += `\n\u200b`)
}

const generateEmbed = (system) => {
	const embed = new Discord.MessageEmbed()
		.setColor(embedColor)
		.setTitle(`Frakcie v systéme ${system.name[0].toUpperCase() + system.name.slice(1)}`)
		.setDescription(
			`[INARA](https://inara.cz/starsystem/?search=${system.webName})\n${divider}`
		)
		.setFooter(
			`Last update: ${system.lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')} ${
				system.isUpdated ? `✅` : `❌`
			}`
		)

	system.data.forEach((el) => {
		embed.addField(`${el.influence}% - ${el.name}`, `${getStates(el)}`, false)
	})

	return embed
}

module.exports = {
	name: 'inf',
	description: 'Vypíše **influence** a stavy frakcíí v systéme',
	arguments: [
		{
			name: 'system',
			description: 'Systém pre výpis',
		},
	],
	async execute(message, args) {
		try {
			if (!validateArgs(args, message)) return

			const { systemName, systemNameWeb } = parseSystemName(args)
			const url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemNameWeb}`

			const fetchedData = await got(url).json()
			if (JSON.stringify(fetchedData) === '{}') {
				systemError(systemName, message)
				return
			}

			const { systemData, lastUpdate } = processFetchedData(fetchedData)
			if (systemData == null) {
				displayError(`Chyba pri spracovaní dát systému`, message)
				return
			}

			const tickTime = await getTickTime()
			if (tickTime == null) {
				tickError(message)
				return
			}

			message.channel.send({
				embed: generateEmbed({
					name: systemName,
					webName: systemNameWeb,
					lastUpdate,
					isUpdated: wasAfterTick(lastUpdate, tickTime),
					data: systemData,
				}),
			})
		} catch (error) {
			console.log(error)
		}
	},
}
