const got = require('got')
const moment = require('moment')
// eslint-disable-next-line no-unused-vars
const momenttz = require('moment-timezone')

moment.locale('sk')

function wasAfterTick(lastUpdate, tickTime) {
	const tickTimeLocal = tickTime.tz('Europe/Berlin')

	const difference = (lastUpdate - tickTimeLocal) / 1000 / 60
	if (difference > 0) return true

	return false
}

// eslint-disable-next-line consistent-return
async function getTickTime() {
	try {
		const timeToday = Math.floor(new Date().getTime() / 1000.0)
		let timeYesterday = new Date()
		timeYesterday.setDate(timeYesterday.getDate() - 2)
		timeYesterday = Math.floor(timeYesterday.getTime() / 1000.0)

		const url = `https://elitebgs.app/api/ebgs/v5/ticks?timeMin=${timeYesterday}000&timeMax=${timeToday}000`
		const fetchedData = await got(url).json()
		if (JSON.stringify(fetchedData) === '[]') return null

		return moment.utc(fetchedData[0].time)
	} catch (error) {
		console.log(error)
	}
}

module.exports = { wasAfterTick, getTickTime }
