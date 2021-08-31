const Discord = require('discord.js')
const { divider, embedColor } = require('../config.json')

module.exports = {
	name: 'help',
	description: 'Help!',
	execute(message) {
		/* message.channel.send(`**Podporované príkazy:**\n
\`?help\` - Vypíše zoznam podporovaných príkazov
\`?inf <system>\` - Vypíše influence a stavy frakcíí v systéme
\`?itrc <argument>\`
		- \`stations\` - Vypíše všetky stanice pod kontrolou ITRC
		- \`conflicts\` - Vypíše všetky konflikty ITRC
\`?trader <system>\` - Vypíše 5 najbližších Material Traderov
\`?broker <system>\` - Vypíše 5 najbližších Technology Brokerov
\`?factors <system>\` - Vypíše 5 najbližších Interstellar Factors (len Orbitaly s L padmi)
			`); */

		const outputEmbed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setTitle('🔨 Podporované príkazy')
			.setDescription(
				`${divider}\n\`?help\` - Vypíše **zoznam** podporovaných príkazov \n\n\
			\`?dis <system1> : <system2>\` - Vypočíta **vzdialenosť** medzi 2 systémami \n\n\
			\`?inf <system>\` - Vypíše **influence** a stavy frakcíí v systéme \n\n\
			\`?itrc <argument>\` \n\
			\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
			\`systems\` - Vypíše všetky **systémy**, v ktorých je ITRC \n\
			\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
				\`stations\` - Vypíše všetky **stanice** pod kontrolou ITRC \n\
			\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
				\`conflicts\` - Vypíše všetky **konflikty** ITRC \n\n\
			\`?tick\` - Vypíše čas posledného BGS **ticku** \n\n\
			\`?trader <system>\` - Vypíše 5 najbližších **Material Traderov** \n\n\
			\`?broker <system>\` - Vypíše 5 najbližších **Technology Brokerov** \n\n\
			\`?factors <system>\` - Vypíše 5 najbližších **Interstellar Factors** (len Orbitaly s L padmi)`
			)

		message.channel.send({ embed: outputEmbed })
	},
}
