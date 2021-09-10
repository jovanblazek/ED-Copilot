const { prefix } = require('../config.json')

module.exports = {
	getCommandSyntax(command) {
		if (command.getSyntax) {
			return command.getSyntax()
		}
		if (command.arguments) {
			return `\`${prefix}${command.name} ${command.arguments
				.map((arg) => `<${arg.name}>`)
				.join(' ')}\``
		}
		return `\`${prefix}${command.name}\``
	},
	getArgumentInfo(argument) {
		return `\`<${argument.name}>\` - ${argument.description}\n`
	},
	getArgumentOptions({ options }) {
		if (options && options.length > 0) {
			return options.map((option) => `\`${option.name}\` - ${option.description}`).join('\n')
		}
		return null
	},
}
