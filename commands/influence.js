const got = require('got')
const moment = require('moment')
const i18next = require('i18next')
const { divider } = require('../config.json')
const { systemError, tickError, displayError } = require('../helpers/error')
const {
	createEmbed,
	validateArgs,
	wasAfterTick,
	getTickTime,
	parseSystemName,
} = require('../helpers')

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
			if (tickTime === null) {
				tickError(message)
			}

			const embed = createEmbed({
				title: `${i18next.t('commands.influence.embedTitle', {
					system: systemName[0].toUpperCase() + systemName.slice(1),
				})}`,
				description: `[INARA](https://inara.cz/starsystem/?search=${systemNameWeb})\n${divider}`,
				footer: `${i18next.t('commands.influence.embedFooter', {
					time: `${lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')} ${
						wasAfterTick(lastUpdate, tickTime) ? `✅` : `❌`
					}`,
				})}`,
			})

			systemData.forEach((faction) => {
				embed.addField(
					`${faction.influence}% - ${faction.name}`,
					`${getStates(faction)}`,
					false
				)
			})

			message.channel.send({
				embed,
			})
		} catch (error) {
			console.log(error)
		}
	},
}
