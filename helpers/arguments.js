const { argsError } = require('./error')

function validateArgs(args, message, maxLength = 5, expectedLength = null) {
	if (!args) {
		argsError(message)
		return false
	}

	if (expectedLength && args.length !== expectedLength) {
		argsError(message)
		return false
	}

	if (args.length > maxLength) {
		argsError(message)
		return false
	}
	return true
}

module.exports = { validateArgs }
