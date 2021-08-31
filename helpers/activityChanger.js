const { prefix, activities } = require('../config.json')

function getRandomActivity() {
	const randomIndex = Math.floor(Math.random() * activities.length)
	const newActivity = activities[randomIndex]

	return {
		status: 'online',
		activity: {
			name: `${newActivity} ${prefix}help`,
			type: 'PLAYING',
		},
	}
}

module.exports = { getRandomActivity }
