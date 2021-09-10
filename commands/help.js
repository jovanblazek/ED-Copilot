const Discord = require('discord.js')
const { validateArgs } = require('../helpers/arguments')
const { divider, embedColor, prefix } = require('../config.json')
const { getCommands } = require('../data/Commands')
const { displayError } = require('../helpers/error')
const { getCommandSyntax, getArgumentOptions, getArgumentInfo } = require('../helpers/commadSyntax')

const DEFAULT_HELP = `${divider}\n\`?help\` - Vypíše **zoznam** podporovaných príkazov \n\n\
\`?dis <system1> : <system2>\` - Vypočíta **vzdialenosť** medzi 2 systémami \n\n\
\`?inf <system>\` - Vypíše **influence** a stavy frakcíí v systéme \n\n\
\`?itrc <argument>\` \n\
\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
\`systems\` - Vypíše všetky **systémy**, v ktorých je ITRC \n\
\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
	\`stations\` - Vypíše všetky **stanice** pod kontrolou ITRC \n\
\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
	\`conflicts\` - Vypíše všetky **konflikty** ITRC \n\n\
\`?tick\` - Vypíše čas posledného BGS **ticku** \n\n\
\`?trader <system>\` - Vypíše 5 najbližších **Material Traderov** \n\n\
\`?broker <system>\` - Vypíše 5 najbližších **Technology Brokerov** \n\n\
\`?factors <system>\` - Vypíše 5 najbližších **Interstellar Factors** (len Orbitaly s L padmi)`

module.exports = {
	name: 'help',
	description: 'Help!',
	execute(message, args) {
		// basic help command
		if (args.length === 0) {
			const outputEmbed = new Discord.MessageEmbed()
				.setColor(embedColor)
				.setTitle('🔨 Podporované príkazy')
				.setDescription(DEFAULT_HELP)

			message.channel.send({ embed: outputEmbed })
			return
		}
		// if have more args than one, don't do anything
		if (!validateArgs(args, message, 1)) {
			return
		}

		const inputCommand = args[0]
		const commands = getCommands()

		if (commands.has(inputCommand)) {
			try {
				const command = commands.get(inputCommand)

				const embed = new Discord.MessageEmbed()
					.setColor(embedColor)
					.setTitle(`${prefix}${command.name} command`)
					.setDescription(`${command.description}\n`)

				embed.addField('✏️ Syntax', `${getCommandSyntax(command)}\n`)

				if (command.arguments) {
					command.arguments.forEach((el) => {
						const argumentOptions = getArgumentOptions(el)
						embed.addField('🔨 Arguments', `${getArgumentInfo(el)}`)
						if (argumentOptions !== null) {
							embed.addField('\u200B', argumentOptions)
						}
					})
				}

				// TODO \n formatting

				message.channel.send(embed)
			} catch (error) {
				console.error(error)
				displayError('Pri vykonávaní príkazu sa vyskytla chyba!', message)
			}
		}
	},
}
