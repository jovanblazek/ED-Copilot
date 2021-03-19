module.exports = {
	name: "help",
	description: "Help!",
	execute(message, args) {
		message.channel.send(`**Podporované príkazy:**\n
\`?help\` - Vypíše zoznam podporovaných príkazov
\`?inf <system>\` - Vypíše influence a stavy frakcíí v systéme
\`?itrc <argument>\`
		- \`stations\` - Vypíše všetky stanice pod kontrolou ITRC
		- \`conflicts\` - Vypíše všetky konflikty ITRC
\`?trader <system>\` - Vypíše 5 najbližších Material Traderov
\`?broker <system>\` - Vypíše 5 najbližších Technology Brokerov
\`?factors <system>\` - Vypíše 5 najbližších Interstellar Factors (len Orbitaly s L padmi)
			`);
	},
};
