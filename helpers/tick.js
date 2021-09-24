const got = require('got')
const moment = require('moment')
// eslint-disable-next-line no-unused-vars
const momenttz = require('moment-timezone')

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
exports.getTickTime = async () => {
	try {
		const url = `https://elitebgs.app/api/ebgs/v5/ticks`
		const fetchedData = await got(url).json()

		if (fetchedData.length === 0) {
			return null
		}
		return moment.utc(fetchedData[0].time)
	} catch (error) {
		console.log(error)
	}
}
