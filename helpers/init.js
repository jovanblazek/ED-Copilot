const got = require('got')
const { factionName } = require('../config.json')
const { setFactionData } = require('../data/Faction')
const { tickDetector } = require('./socketTickDetector')

exports.init = async () => {
	try {
		const factionNameEncoded = encodeURIComponent(factionName)

		const url = `https://elitebgs.app/api/ebgs/v5/factions?name=${factionNameEncoded}`
		const inaraUrl = `https://inara.cz/minorfaction/?search=${factionNameEncoded}`

		const { docs } = await got(url).json()

		setFactionData(docs[0]._id, docs[0].eddb_id, inaraUrl)
		tickDetector()

		console.log('Bot initialized')
	} catch (err) {
		console.error(
			`Initialization error. You probably entered wrong faction name in config.json\n\n`,
			err
		)
		process.exit(1)
	}
}
