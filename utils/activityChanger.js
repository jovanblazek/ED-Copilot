const { prefix, activities } = require('../config.json')

exports.getRandomActivity = () => {
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
