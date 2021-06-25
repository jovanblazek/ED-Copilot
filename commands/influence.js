const got = require("got");
const Discord = require("discord.js");
const { divider, embedColor } = require("../config.json");
const moment = require("moment");
const momenttz = require("moment-timezone");
moment.locale("sk");
const { displayError } = require("./error.js");

module.exports = {
	name: "inf",
	description: "Vypíše influence frakcií v systéme",
	async execute(message, args) {
		try {
			const argsLength = args.length;
			if (!argsLength || argsLength > 5)
			return displayError(`Zlý počet argumentov`, message);

			const { systemName, systemNameWeb } = this.getSystemName(args);
			const url = `https://www.edsm.net/api-system-v1/factions?systemName=${systemNameWeb}`;

			const fetchedData = await got(url).json();
			if (JSON.stringify(fetchedData) === "{}")
				return displayError(`Systém ${systemName} neexistuje`, message);

			const { systemData, lastUpdate } = this.processFetchedData(fetchedData);
			if(systemData == null)
				return displayError(`Chyba pri spracovaní dát systému`, message);

			message.channel.send({
				embed: this.generateEmbed({
					name: systemName,
					url: url,
					lastUpdate: lastUpdate,
					data: systemData,
				}),
			});
		} catch (error) {
			console.log(error);
		}
	},
	getSystemName(args) {
		const argsLength = args.length;
		let systemName = "",
			systemNameWeb = "";

		for (let i = 0; i < argsLength; i++)
			systemName += args[i].toLowerCase() + " ";

		systemName.trim();
		systemNameWeb = encodeURIComponent(systemName);

		return { systemName, systemNameWeb };
	},
	processFetchedData(response) {
		const { factions } = response;
		if(factions == null || factions.length === 0)
			return null;

		let systemData = [];
		let lastUpdate = moment.unix(factions[0].lastUpdate).utc().tz("Europe/Berlin").format("DD.MM.YYYY HH:mm");

		factions.forEach((faction) => {
			if (faction.influence * 100 > 0) {
				let object = {};
				object.name = faction.name;
				object.influence = Math.round(faction.influence * 1000) / 10;
				object.activeStates = faction.activeStates;
				object.pendingStates = faction.pendingStates;
				systemData.push(object);
			}
		});

		return { systemData, lastUpdate };
	},
	getStates(faction) {
		const pending = this.reduceStatesArray(faction.pendingStates);
		const active = this.reduceStatesArray(faction.activeStates);

		if (pending === "" && active === "") return "\u200b";

		let output = "";
		if (pending !== "") output += `🟠 ${pending}`;
		if (active !== "") output += `\n🟢 ${active}`;

		return (output += `\n\u200b`);
	},
	reduceStatesArray(array) {
		return array.reduce(
			(accumulator, currentValue, currentIndex, currentArray) => {
				accumulator = accumulator + currentValue.state;
				if (currentIndex < currentArray.length - 1) {
					accumulator = accumulator + ", ";
				}
				return accumulator;
			},
			""
		);
	},
	generateEmbed(system) {
		const embed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setTitle(`Frakcie v systéme ${system.name[0].toUpperCase() + system.name.slice(1)}`)
			.setDescription(`[INARA](${system.url})\n${divider}`)
			.setFooter(`Last update: ${system.lastUpdate}`);

		system.data.forEach((el) => {
			embed.addField(
				`${el.influence}% - ${el.name}`,
				`${this.getStates(el)}`,
				false
			);
		});

		return embed;
	},
};
