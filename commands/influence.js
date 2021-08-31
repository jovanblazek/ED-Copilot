const got = require('got')
const Discord = require('discord.js')
const moment = require('moment')
// eslint-disable-next-line no-unused-vars
const momenttz = require('moment-timezone')
const { divider, embedColor } = require('../config.json')

moment.locale('sk')
const { argsError, systemError, tickError, displayError } = require('../helpers/error')
const { parseSystemName } = require('../helpers/systemName')
const { wasAfterTick, getTickTime } = require('../helpers/tick')

module.exports = {
	name: 'inf',
	description: 'Vypíše influence frakcií v systéme',
	async execute(message, args) {
		try {
			const argsLength = args.length
			if (!argsLength || argsLength > 5) {
				argsError(message)
				return
			}

			const { systemName, systemNameWeb } = parseSystemName(args)
			const url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemNameWeb}`

			const fetchedData = await got(url).json()
			if (JSON.stringify(fetchedData) === '{}') {
				systemError(systemName, message)
				return
			}

			const { systemData, lastUpdate } = this.processFetchedData(fetchedData)
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
				embed: this.generateEmbed({
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
	processFetchedData(response) {
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
	},
	getStates(faction) {
		const pending = this.reduceStatesArray(faction.pendingStates)
		const active = this.reduceStatesArray(faction.activeStates)

		if (pending === '' && active === '') return '\u200b'

		let output = ''
		if (pending !== '') output += `🟠 ${pending}`
		if (active !== '') output += `\n🟢 ${active}`

		// eslint-disable-next-line no-return-assign
		return (output += `\n\u200b`)
	},
	reduceStatesArray(array) {
		return array.reduce((accumulator, currentValue, currentIndex, currentArray) => {
			// eslint-disable-next-line no-param-reassign
			accumulator += currentValue.state
			if (currentIndex < currentArray.length - 1) {
				// eslint-disable-next-line no-param-reassign
				accumulator += ', '
			}
			return accumulator
		}, '')
	},
	generateEmbed(system) {
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
			embed.addField(`${el.influence}% - ${el.name}`, `${this.getStates(el)}`, false)
		})

		return embed
	},
}
