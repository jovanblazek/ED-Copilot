const got = require("got");
const Discord = require("discord.js");
const { divider } = require("../config.json");
const moment = require('moment');
const momenttz = require('moment-timezone');
moment.locale('sk');

module.exports = {
	name: "inf",
	description: "Vypíše influence frakcií v systéme",
	async execute(message, args) {
		try {
			if (!args.length || args.length > 5)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);

			let systemName = "",
				systemNameWeb = "";
			for (let i = 0; i < args.length; i++)
				systemName += args[i].toLowerCase() + " ";
			
			systemName.trim();
			systemNameWeb = encodeURIComponent(systemName);

			let url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemNameWeb}`;

			const output = await got(url)
				.then((response) => {
					let data = [];

					if (response.body.length == 2)
						return message.channel.send(
							`Systém ${systemName} neexistuje, ${message.author}!`
						);

					const resJson = JSON.parse(response.body);

					const factions = resJson.factions;
					factions.forEach((faction) => {
						if (faction.influence * 100 > 0) {
							let object = {};
							object.name = faction.name;
							object.influence =
								Math.round(faction.influence * 1000) / 10;
							object.activeStates = faction.activeStates;
							object.pendingStates = faction.pendingStates;
							object.lastUpdate = moment.unix(faction.lastUpdate).utc();
							data.push(object);
						}
					});

					return data;
				})
				.catch((err) => {
					console.log(err);
				});

			if (output != null || output != undefined) {
				const outputEmbed = new Discord.MessageEmbed()
					.setColor("#ffa500")
					.setTitle(
						`Frakcie v systéme ${
							systemName[0].toUpperCase() + systemName.slice(1)
						}`
					)
					.setDescription(
						`[INARA](https://inara.cz/starsystem/?search=${systemNameWeb})\n${divider}`
					)
					.setFooter(
						`Last update: ${output[0].lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')}`
					);

				output.forEach((el) => {
					outputEmbed.addField(
						`${el.influence}% - ${el.name}`,
						`${this.getStates(el)}`,
						false
					);
				});

				message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
	getStates(element) {
		const pending = element.pendingStates.reduce(
			(accumulator, currentValue, currentIndex, currentArray) => {
				accumulator = accumulator + currentValue.state;
				if (currentIndex < currentArray.length - 1) {
					accumulator = accumulator + ", ";
				}
				return accumulator;
			},
			""
		);

		const active = element.activeStates.reduce(
			(accumulator, currentValue, currentIndex, currentArray) => {
				accumulator = accumulator + currentValue.state;
				if (currentIndex < currentArray.length - 1) {
					accumulator = accumulator + ", ";
				}
				return accumulator;
			},
			""
		);
		if (pending === "" && active === "") return "\u200b";

		let output = "";
		if (pending !== "") output += `🟠 ${pending}`;
		if (active !== "") output += `\n🟢 ${active}`;

		return (output += `\n\u200b`);
	},
};
