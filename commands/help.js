const Discord = require('discord.js')
const { validateArgs } = require('../helpers/arguments')
const { divider, embedColor, prefix } = require('../config.json')
const { getCommands } = require('../data/Commands')
const { getCommandSyntax, getArgumentOptions, getArgumentInfo } = require('../helpers/commadSyntax')

module.exports = {
	name: 'help',
	description: 'Somebody get help!',
	arguments: [
		{
			name: 'command',
			description: 'Príkaz, ktorého informácie chceš vedieť',
			optional: true,
		},
	],
	execute(message, args) {
		const commands = getCommands()

		// basic help command
		if (args.length === 0) {
			let defaultHelp = `Pre viac info použi príkaz \`?help <command>\`\n${divider}\n`

			commands.forEach((command) => {
				defaultHelp += `${getCommandSyntax(command)} - ${command.description}\n\n`
			})

			const outputEmbed = new Discord.MessageEmbed()
				.setColor(embedColor)
				.setTitle('🔨 Podporované príkazy')
				.setDescription(defaultHelp)

			message.channel.send({ embed: outputEmbed })
			return
		}

		// if have more args than one, don't do anything
		if (!validateArgs(args, message, 1)) {
			return
		}

		const inputCommand = args[0]

		if (commands.has(inputCommand)) {
			const command = commands.get(inputCommand)

			const embed = new Discord.MessageEmbed()
				.setColor(embedColor)
				.setTitle(`${prefix}${command.name} command`)
				.setDescription(`${command.description}`)

			embed.addField('\u200B\n✏️ Syntax', `${getCommandSyntax(command)}`)

			if (command.arguments) {
				let output = ''
				command.arguments.forEach((el) => {
					output += getArgumentInfo(el)

					const argumentOptions = getArgumentOptions(el)
					if (argumentOptions !== null) {
						output += `\n${argumentOptions}\n\n`
					}
				})
				embed.addField('\u200B\n🔨 Arguments', output)
			}

			message.channel.send(embed)
		}
	},
}
