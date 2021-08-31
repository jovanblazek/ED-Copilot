const { argsError } = require('./error')

function validateArgs(args, message, maxLength = 5) {
	if (!args) return false

	if (args.length > maxLength) {
		argsError(message)
		return false
	}
	return true
}

module.exports = { validateArgs }
