const { prefix } = require('../config.json')

module.exports = {
	getCommandSyntax(command) {
		if (command.getSyntax) {
			return command.getSyntax()
		}
		return `${prefix}${command.name}${command.arguments.map((arg) => ` <${arg.name}>`)}`
	},
	getArgumentOptions(argument) {
		return `${argument.name} \n ${argument.options.map(
			(option) => `${option.name} - ${option.description}\n`
		)}`
	},
}
