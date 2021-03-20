const got = require("got");
const Discord = require("discord.js");
const { divider } = require("../config.json");

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
			for (let i = 0; i < args.length; i++) {
				systemName += args[i].toLowerCase() + " ";
				systemNameWeb += args[i].toLowerCase() + "%20";
			}

			let url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemName}`;

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
							object.lastUpdate = faction.lastUpdate;
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
						`Last update: ${this.convertDatetime(
							output[0].lastUpdate
						)}`
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
	convertDatetime(element) {
		let date = new Date(element * 1000);

		let year = date.getFullYear().toString();
		let month = (date.getMonth() + 1).toString().padStart(2, "0");
		let day = date.getDate().toString().padStart(2, "0");
		let hours = date.getHours().toString().padStart(2, "0");
		let minutes = date.getMinutes().toString().padStart(2, "0");

		return day + "." + month + "." + year + " " + hours + ":" + minutes;
	},
};
