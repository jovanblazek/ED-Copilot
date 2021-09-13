const { init } = require('./init')
const { getRandomActivity } = require('./activityChanger')
const { validateArgs } = require('./arguments')
const { parseSystemName } = require('./systemName')
const { getTickTime, wasAfterTick } = require('./tick')
const { createEmbed } = require('./embed')
const { getCommandSyntax, getArgumentInfo, getArgumentOptions } = require('./commadSyntax')

module.exports = {
	createEmbed,
	init,
	getArgumentInfo,
	getArgumentOptions,
	getCommandSyntax,
	getRandomActivity,
	getTickTime,
	parseSystemName,
	validateArgs,
	wasAfterTick,
}
