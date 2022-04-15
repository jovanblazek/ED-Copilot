const got = require('got')
const moment = require('moment')
const { divider, factionNameShort } = require('../../config.json')
const { getFactionInaraUrl, getFactionEddbId, getFactionId } = require('../../data/Faction')
const { createEmbed, wasAfterTick, fetchTickTime, tickError } = require('../../utils')

const parseConflictsData = (systemsPresent, tickTime) => {
	const parsedData = []
	const factionId = getFactionId()
	systemsPresent.forEach(
		({
			conflicts,
			system_details: systemDetails,
			system_name: systemName,
			updated_at: updatedAt,
		}) => {
			if (!conflicts.length) return

			const record = {}
			record.faction1 = {}
			record.faction2 = {}

			// if there are multiple conflicts in single system, find the one with user faction
			const index = systemDetails.conflicts.findIndex(
				({ faction1, faction2 }) =>
					faction1.faction_id === factionId || faction2.faction_id === factionId
			)

			const conflict = systemDetails.conflicts[index]

			record.system = systemName
			record.lastUpdate = moment.utc(updatedAt)
			record.isUpdated = wasAfterTick(record.lastUpdate, tickTime)
			record.status = conflict.status

			// read from conflict - print to object
			;['name', 'stake', 'days_won'].forEach(
				(prop) => (record.faction1[prop] = conflict.faction1[prop])
			)
			;['name', 'stake', 'days_won'].forEach(
				(prop) => (record.faction2[prop] = conflict.faction2[prop])
			)

			// determine which faction belongs to user
			if (conflict.faction1.faction_id === factionId) {
				record.faction1.isPlayer = true
			} else {
				record.faction2.isPlayer = true
			}

			parsedData.push(record)
		}
	)
	return parsedData
}

const printConflict = (embed, player, enemy, conflict) => {
	embed.addField(
		`${divider}`,
		`**${factionNameShort} vs ${enemy.name}**\n<:system:822765748111671326> ${conflict.system}`
	)
	if (conflict.status === 'pending') embed.addField(`\`pending\``, '\u200B', true)
	else embed.addField(`\`${player.days_won} vs ${enemy.days_won}\``, '\u200B', true)

	embed.addField(`🏆 ${enemy.stake || ' ---'}`, `💥 ${player.stake || ' ---'}`, true)
	embed.addField(
		`\u200B`,
		`${conflict.lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')} ${
			conflict.isUpdated ? `✅` : `❌`
		}`
	)
}

const generateConflictsEmbed = (data) => {
	const embed = createEmbed({
		title: `${factionNameShort} Conflicts`,
		description: `[INARA](${getFactionInaraUrl()})\n${divider}`,
	})

	if (!data.length) {
		embed.addField(`Žiadne konflikty 🎉`, '\u200B')
	} else {
		data.forEach((conflict) => {
			if (conflict.faction1.isPlayer)
				printConflict(embed, conflict.faction1, conflict.faction2, conflict)
			else printConflict(embed, conflict.faction2, conflict.faction1, conflict)
		})
	}

	return embed
}

module.exports = {
	async getFactionConflicts(message) {
		try {
			const conflictsUrl = `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${getFactionEddbId()}&systemDetails=true`

			const fetchedData = await got(conflictsUrl).json()

			const tickTime = await fetchTickTime()
			if (tickTime == null) {
				tickError(message)
			}

			const parsedData = parseConflictsData(fetchedData.docs[0].faction_presence, tickTime)
			message.channel.send({ embed: generateConflictsEmbed(parsedData) })
		} catch (error) {
			console.log(error)
		}
	},
}
