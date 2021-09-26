const i18next = require('i18next')

module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message) {
		if (Math.floor(Math.random() * 20) === 0) {
			message.channel.send('Pong BITCH!')
			return
		}
		message.channel.send(i18next.t('key'))
	},
}
