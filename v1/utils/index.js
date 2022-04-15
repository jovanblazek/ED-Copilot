const { init } = require('./init')
const { getRandomActivity } = require('./activityChanger')
const { validateArgs } = require('./arguments')
const { parseSystemName } = require('./systemName')
const { fetchTickTime, wasAfterTick } = require('./tick')
const { createEmbed } = require('./embed')
const { tickDetector } = require('./tickDetector')
const { getCommandSyntax, getArgumentInfo, getArgumentOptions } = require('./commadSyntax')
const { getStationIcon, addSuffixToInt, printTrend } = require('./helpers')

module.exports = {
	createEmbed,
	init,
	getArgumentInfo,
	getArgumentOptions,
	getCommandSyntax,
	getRandomActivity,
	fetchTickTime,
	parseSystemName,
	tickDetector,
	validateArgs,
	wasAfterTick,
	getStationIcon,
	addSuffixToInt,
	printTrend,
}
