const got = require("got");
const Discord = require("discord.js");
const { embedColor } = require("../config.json");
const { argsError, systemError } = require("../helpers/error.js");

module.exports = {
	name: "dis",
	description: "Vyráta vzdialenosť medzi dvoma systémami",
	async execute(message, args) {
		try {
			if (!args.length) return argsError(message);

			let systems = args.join(" ").split(":");

			if (systems.length != 2) return argsError(message);

			const systemName1 = systems[0].trim(),
				systemName2 = systems[1].trim();

			const coords1 = await this.getSystemCoords(systemName1);
			const coords2 = await this.getSystemCoords(systemName2);

			if (coords1 == null) return systemError(systemName1, message);
			if (coords2 == null) return systemError(systemName2, message);

			if (!("x" in coords1 && "x" in coords2)) return;

			let a = coords2.x - coords1.x;
			let b = coords2.y - coords1.y;
			let c = coords2.z - coords1.z;

			const distance = Math.sqrt(a * a + b * b + c * c).toFixed(2);

			message.channel.send({
				embed: this.generateEmbed(systemName1, systemName2, distance),
			});
		} catch (error) {
			console.log(error);
		}
	},
	generateEmbed(systemName1, systemName2, distance) {
		const embed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setTitle(
				`${
					systemName1[0].toUpperCase() + systemName1.slice(1)
				}  <- ${distance} ly ->  ${
					systemName2[0].toUpperCase() + systemName2.slice(1)
				}`
			);

		return embed;
	},
	async getSystemCoords(systemName) {
		const systemNameWeb = encodeURIComponent(systemName);
		const url = `https://www.edsm.net/api-v1/system?systemName=${systemNameWeb}&showCoordinates=1`;

		const fetchedData = await got(url).json();
		if (JSON.stringify(fetchedData) === "[]") return null;
		return fetchedData.coords;
	},
};
