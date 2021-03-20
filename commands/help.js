const Discord = require("discord.js");
module.exports = {
	name: "help",
	description: "Help!",
	execute(message, args) {
		/*message.channel.send(`**Podporované príkazy:**\n
\`?help\` - Vypíše zoznam podporovaných príkazov
\`?inf <system>\` - Vypíše influence a stavy frakcíí v systéme
\`?itrc <argument>\`
		- \`stations\` - Vypíše všetky stanice pod kontrolou ITRC
		- \`conflicts\` - Vypíše všetky konflikty ITRC
\`?trader <system>\` - Vypíše 5 najbližších Material Traderov
\`?broker <system>\` - Vypíše 5 najbližších Technology Brokerov
\`?factors <system>\` - Vypíše 5 najbližších Interstellar Factors (len Orbitaly s L padmi)
			`);*/

		const outputEmbed = new Discord.MessageEmbed()
			.setColor("#ffa500")
			.setTitle("🔨 Podporované príkazy")
			.setDescription("\n\`?help\` - Vypíše **zoznam** podporovaných príkazov \n\n\
			\`?inf <system>\` - Vypíše **influence** a stavy frakcíí v systéme \n\n\
			\`?itrc <argument>\` \n\
			\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
				\`stations\` - Vypíše všetky **stanice** pod kontrolou ITRC \n\
			\u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \u200B \
				\`conflicts\` - Vypíše všetky **konflikty** ITRC \n\n\
			\`?trader <system>\` - Vypíše 5 najbližších **Material Traderov** \n\n\
			\`?broker <system>\` - Vypíše 5 najbližších **Technology Brokerov** \n\n\
			\`?factors <system>\` - Vypíše 5 najbližších **Interstellar Factors** (len Orbitaly s L padmi)");


		message.channel.send({ embed: outputEmbed });
	},
};
