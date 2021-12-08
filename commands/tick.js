const moment = require('moment')
const { tickError } = require('../utils/error')
const { tickReportChannel } = require('../config.json')
const { createEmbed, validateArgs, fetchTickTime } = require('../utils')

module.exports = {
	name: 'tick',
	description: 'Vypíše dátum a čas posledného BGS **ticku**',
	async execute(message, args, client = null) {
		try {
			if (!validateArgs(args, message, 0)) return

			const tickTime = await fetchTickTime()
			if (tickTime === null) {
				tickError(message)
				return
			}

			const difference = tickTime.tz('Europe/Berlin').from(moment.tz('Europe/Berlin'))

			const embed = createEmbed({
				title: `Posledný TICK`,
				description: `**${tickTime.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')}**
				${difference}\n
				Dnes: ${this.wasTickToday(tickTime) ? '✅' : '❌'}\n
				[HISTÓRIA](https://elitebgs.app/tick)`,
			})

			if (client != null) {
				client.channels.cache.get(tickReportChannel).send({ embed })
			} else {
				message.channel.send({ embed })
			}
		} catch (error) {
			console.log(error)
		}
	},
	wasTickToday(tickTime) {
		return tickTime.tz('Europe/Berlin').date() === moment.tz('Europe/Berlin').date()
	},
}
