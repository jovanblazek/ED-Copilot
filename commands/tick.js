const moment = require('moment')
const { tickError } = require('../helpers/error')
const { tickReportChannel } = require('../config.json')
const { createEmbed, validateArgs, getTickTime } = require('../helpers')

moment.locale('sk')

module.exports = {
	name: 'tick',
	description: 'Vypíše dátum a čas posledného BGS **ticku**',
	async execute(message, args, client = null) {
		try {
			if (!validateArgs(args, message, 0)) return

			const tickTime = await getTickTime()
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
	async checkTick(client) {
		try {
			const tickTime = await getTickTime()
			if (tickTime === null) {
				console.log(
					'Error, getTickTime() returned null in checkTick() method in commands/tick.js'
				)
				return
			}

			if (this.wasTickToday(tickTime)) {
				let difference = tickTime.tz('Europe/Berlin') - moment.tz('Europe/Berlin')
				difference = Math.abs(difference / 1000 / 60 / 60)
				console.log(`Last tick: ${difference} hours ago.`)

				// if tick occured in last hour execute these commands
				if (difference < 1) {
					client.commands.get('tick').execute(null, [], client)
					client.commands.get('itrc').systems(null, client)
				}
			}
			return
		} catch (error) {
			console.log(error)
		}
	},
	wasTickToday(tickTime) {
		return tickTime.tz('Europe/Berlin').date() === moment.tz('Europe/Berlin').date()
	},
}
