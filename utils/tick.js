const got = require('got')
const moment = require('moment')
// eslint-disable-next-line no-unused-vars
const momenttz = require('moment-timezone')
const { getTickTime, setTickTime } = require('../data/Tick')

// TODO this sets moment locale for entire app, move this somewhere into init sequence
moment.locale('sk')

exports.wasAfterTick = (lastUpdate, tickTime) => {
	if (tickTime === null) {
		return false
	}

	const tickTimeLocal = tickTime.tz('Europe/Berlin')
	const difference = (lastUpdate - tickTimeLocal) / 1000 / 60

	if (difference > 0) {
		return true
	}

	return false
}

// eslint-disable-next-line consistent-return
exports.fetchTickTime = async () => {
	// Return saved value if it's not null, otherwise, fetch it and save
	const savedTickTime = getTickTime()
	if (savedTickTime) {
		return savedTickTime
	}
	try {
		const url = `https://elitebgs.app/api/ebgs/v5/ticks`
		const fetchedData = await got(url).json()

		if (fetchedData.length === 0) {
			return null
		}
		const tickTime = moment.utc(fetchedData[0].time)
		setTickTime(tickTime)
		return tickTime
	} catch (error) {
		console.log(error)
	}
}
