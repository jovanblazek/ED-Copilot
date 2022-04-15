module.exports = {
	getStationIcon(stationTypeInt) {
		let type
		let priority
		switch (parseInt(stationTypeInt)) {
			case 1:
			case 12:
			case 13:
				type = '<:coriolis:822765325350076426> Starport'
				priority = 1
				break
			case 3:
				type = '<:outpost:822765313870397460> Outpost'
				priority = 2
				break
			case 14:
			case 15:
				type = '<:surface:822765337548029962> Planetary port'
				priority = 3
				break
			default:
				type = '<:other:822765350536871946> Other'
				priority = 4
				break
		}
		return { type, priority }
	},
	addSuffixToInt(value) {
		const suffixes = ['', 'k', 'm', 'b', 't']
		const suffixNum = Math.floor(`${value}`.length / 3)
		let shortValue = parseFloat(
			(suffixNum !== 0 ? value / 1000 ** suffixNum : value).toPrecision(2)
		)
		if (shortValue % 1 !== 0) {
			shortValue = shortValue.toFixed(1)
		}
		return shortValue + suffixes[suffixNum]
	},
	printTrend(trend) {
		return trend < 0
			? `<:arrow_red:842824890918764544> ${trend}%`
			: `<:arrow_green:842824851072614487> +${trend}%`
	},
}
