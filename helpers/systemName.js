function parseSystemName(args) {
	const argsLength = args.length
	let systemName = ''
	let systemNameWeb = ''

	for (let i = 0; i < argsLength; i++) systemName += `${args[i].toLowerCase()} `

	systemName = systemName.trim()
	systemNameWeb = encodeURIComponent(systemName)

	return { systemName, systemNameWeb }
}

module.exports = { parseSystemName }
