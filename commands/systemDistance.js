const got = require("got");
const Discord = require("discord.js");
const { divider } = require("../config.json");

module.exports = {
	name: "dis",
	description: "Vyráta vzdialenosť medzi dvoma systémami",
	async execute(message, args) {
		try {
			if (!args.length)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);

			let systems = args.join(" ").split(":");

			if (systems.length != 2)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);

			let systemName1 = systems[0].trim(),
				systemName2 = systems[1].trim();

			const systemName1Web = encodeURIComponent(systemName1);
			const systemName2Web = encodeURIComponent(systemName2);

			let url1 = `https://www.edsm.net/api-v1/system?systemName=${systemName1Web}&showCoordinates=1`;
			let url2 = `https://www.edsm.net/api-v1/system?systemName=${systemName2Web}&showCoordinates=1`;

			const coords1 = await got(url1)
				.then((response) => {
					if (response.body.length == 2)
						return message.channel.send(
							`Systém ${systemName1} neexistuje, ${message.author}!`
						);
					const resJson = JSON.parse(response.body);
					return resJson.coords;
				})
				.catch((err) => {
					console.log(err);
				});

			const coords2 = await got(url2)
				.then((response) => {
					if (response.body.length == 2)
						return message.channel.send(
							`Systém ${systemName2} neexistuje, ${message.author}!`
						);
					const resJson = JSON.parse(response.body);
					return resJson.coords;
				})
				.catch((err) => {
					console.log(err);
				});
			
			if(!('x' in coords1 && 'x' in coords2))
				return;
				
			let a = coords2.x - coords1.x;
			let b = coords2.y - coords1.y;
			let c = coords2.z - coords1.z;

			const output = Math.sqrt(a * a + b * b + c * c).toFixed(2);

			if (output != null || output != undefined) {
				const outputEmbed = new Discord.MessageEmbed()
					.setColor("#ffa500")
					.setTitle(
						`${
							systemName1[0].toUpperCase() + systemName1.slice(1)
						}  <- ${output} ly ->  ${
							systemName2[0].toUpperCase() + systemName2.slice(1)
						}`
					);

				message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
};
