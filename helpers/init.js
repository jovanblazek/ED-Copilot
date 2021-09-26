const got = require('got')
const i18next = require('i18next')
const fs = require('fs')
const { factionName, language } = require('../config.json')
const { setFactionData } = require('../data/Faction')

const loadLocales = () => {
	const result = []
	const files = fs.readdirSync('./locales').filter((file) => file.endsWith('.json'))
	files.forEach((file) => {
		// eslint-disable-next-line import/no-dynamic-require
		const jsonFile = require(`../locales/${file}`)
		result.push(jsonFile)
	})
	return Object.assign({}, ...result)
}

exports.init = async () => {
	try {
		const factionNameEncoded = encodeURIComponent(factionName)

		const url = `https://elitebgs.app/api/ebgs/v5/factions?name=${factionNameEncoded}`
		const inaraUrl = `https://inara.cz/minorfaction/?search=${factionNameEncoded}`

		const { docs } = await got(url).json()

		setFactionData(docs[0]._id, docs[0].eddb_id, inaraUrl)

		i18next.init({
			lng: language,
			fallbackLng: 'en',
			debug: true,
			resources: {
				...loadLocales(),
			},
		})

		console.log('Bot initialized')
	} catch (err) {
		console.error(
			`Initialization error. You probably entered wrong faction name in config.json\n\n`,
			err
		)
		process.exit(1)
	}
}
