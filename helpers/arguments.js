const { argsError } = require('./error')

function validateArgs(args, message, expectedLength = 5) {
	if (!args) return false

	if (args.length > expectedLength) {
		argsError(message)
		return false
	}
	return true
}

module.exports = { validateArgs }
