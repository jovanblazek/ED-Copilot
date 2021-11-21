const { createEmbed, validateArgs, parseSystemName } = require('../helpers')

module.exports = {
	name: 'inara',
	description: 'Vyhľadá systém na inara.cz a vráti **link stránky systému**',
	arguments: [
		{
			name: 'system',
			description: 'Systém, ktorého link potrebuješ',
		},
	],
	async execute(message, args) {
		try {
			if (!validateArgs(args, message)) return

			const { systemName, systemNameWeb } = parseSystemName(args)
			const url = `https://inara.cz/starsystem/?search=${systemNameWeb}`

			const embed = createEmbed({
				title: `${systemName.toUpperCase()}`,
				description: `[${url}](${url})`,
			})

			message.channel.send({ embed })
		} catch (error) {
			console.log(error)
		}
	},
}
