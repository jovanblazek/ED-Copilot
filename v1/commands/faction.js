const { validateArgs, displayError } = require('../utils')
const { getFactionConflicts } = require('./faction/conflicts')
const { getFactionStations } = require('./faction/stations')
const { getFactionSystemsInfo } = require('./faction/systems')

module.exports = {
	name: 'itrc',
	description: 'Vypíše rôzne informácie o ITRC ako napríklad stav konfliktov.',
	arguments: [
		{
			name: 'argument',
			description: 'Typ commandu, ktorý chceš zavolať',
			options: [
				{
					name: 'conflicts',
					description: 'Vypíše **konflikty** ITRC',
				},
				{
					name: 'stations',
					description: 'Vypíše **stanice** pod kontrolou ITRC',
				},
				{
					name: 'systems',
					description: 'Vypíše **systémy**, v ktorých je ITRC',
				},
			],
		},
	],
	async execute(message, args) {
		if (!validateArgs(args, message, 1, 1)) return

		switch (args[0]) {
			case 'systems':
				getFactionSystemsInfo(message)
				break
			case 'conflicts':
				getFactionConflicts(message)
				break
			case 'stations':
				getFactionStations(message)
				break
			default:
				displayError(`Neznámy argument ${args[0]}`, message)
		}
	},
}
