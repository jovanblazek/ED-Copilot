const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Discord = require("discord.js");
const { argsError, displayError, tickError } = require("../helpers/error.js");
const moment = require("moment");
const momenttz = require("moment-timezone");
const { divider, embedColor, inaraFactionUrl, tickReportChannel, eddbid, factionId } = require("../config.json");
const {wasAfterTick, getTickTime} = require("../helpers/tick.js");
moment.locale("sk");

module.exports = {
	name: "itrc",
	description: "Vypíše konflikty ITRC",
	conflictsUrl: `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${eddbid}&systemDetails=true`,
	systemsUrl: `https://elitebgs.app/api/ebgs/v5/factions?eddbId=${eddbid}&systemDetails=true&count=2`,
	execute(message, args) {
		try {
			const argsLength = args.length;
			if (!argsLength || argsLength > 1)
				return argsError(message);

			if (args[0] === "conflicts") this.conflicts(message);
			else if (args[0] === "stations") this.stations(message);
			else if (args[0] === "systems") this.systems(message);
			else 
				displayError(`Neznámy argument ${args[0]}`, message);
			
		} catch (error) {
			console.log(error);
		}
	},
	async conflicts(message) {
		try {
			const fetchedData = await got(this.conflictsUrl).json();

			const tickTime = await getTickTime();
			if(tickTime == null)
				return tickError(message);
			
			const parsedData = this.parseConflictsData(fetchedData.docs[0].faction_presence, tickTime);
			message.channel.send({ embed: this.generateConflictsEmbed(parsedData) });
		} catch (error) {
			console.log(error);
		}
	},
	async stations(message) {
		try {
			const fetchedData = await got(inaraFactionUrl);
			const dom = new JSDOM(fetchedData.body);
			const rows = dom.window.document.querySelectorAll(
				".maincontent1 > div.maintable table tbody tr"
			);
			if (rows.length == 0) return message.channel.send(`Žiadne stanice`);

			const parsedData = this.parseStationData(rows);

			//sort by system name
			parsedData.sort((a, b) => {
				const systemA = a.system.toUpperCase();
				const systemB = b.system.toUpperCase();

				if (systemA > systemB) return 1;
				else if (systemA < systemB) return -1;

				return 0;
			});

			//convert data to array of system objects with array of stations
			let result = [];
			let didpush = false;
			parsedData.forEach(el => {
				didpush = false;

				if(result.length) {
					result.forEach(resEl => {
						if(resEl.system === el.system){
							resEl.stations.push({
								name: el.stationName,
								type: el.type,
								priority: el.priority
							});
							didpush = true;
							return;
						}
					});
					if(didpush == false) {
						result.push({
							system: el.system,
							stations: [{
								name: el.stationName,
								type: el.type,
								priority: el.priority
							}]
						})
					}
				}
				else {
					result.push({
						system: el.system,
						stations: [{
							name: el.stationName,
							type: el.type,
							priority: el.priority
						}]
					})
				}
			})

			//sort by station priority
			result.forEach(el => {
				el.stations.sort((a, b) => {
					const stationA = a.priority;
					const stationB = b.priority;

					if (stationA > stationB) return 1;
					else if (stationA < stationB) return -1;

					return 0;
				});
			});

			message.channel.send({ embed: this.generateStationsEmbed(result) });
				
		} catch (error) {
			console.log(error);
		}
	},
	async systems(message, client = null) {
		try {
			const fetchedData = await got(this.systemsUrl).json();
			const parsedData = this.parseSystemsData(fetchedData.docs[0].faction_presence);
			this.calculateInfluenceHistory(parsedData, fetchedData.docs[0].history);

			const tickTime = await getTickTime();
			if(tickTime == null)
				return tickError(message);
			
			parsedData.forEach(data => data.isUpdated = wasAfterTick(data.lastUpdate, tickTime));
			if (client != null)
				client.channels.cache.get(tickReportChannel).send({ embed: this.generateSystemsEmbed(parsedData) });
			else message.channel.send({ embed: this.generateSystemsEmbed(parsedData) });
		} catch (error) {
			console.log(error);
		}
	},
	addSuffixToInt(value) {
		const suffixes = ["", "k", "m", "b", "t"];
		const suffixNum = Math.floor(("" + value).length / 3);
		let shortValue = parseFloat(
			(suffixNum != 0
				? value / Math.pow(1000, suffixNum)
				: value
			).toPrecision(2)
		);
		if (shortValue % 1 != 0) {
			shortValue = shortValue.toFixed(1);
		}
		return shortValue + suffixes[suffixNum];
	},
	calculateInfluenceHistory(data, history) {
		const dataLength = data.length;
		const historyLength = history.length;
		for (let i = 0; i < dataLength; i++) {
			for (let j = 0; j < historyLength; j++) {
				if (
					data[i].system === history[j].system &&
					data[i].realInfluence !== history[j].influence
				) {
					//console.log('Before '+ history[j].influence+ '-- After ' +data[i].realInfluence);
					data[i].trend =
						data[i].realInfluence - history[j].influence;
					data[i].trend = (
						Math.round(data[i].trend * 1000) / 10
					).toFixed(1);
				}
			}
		}
	},
	printTrend(trend) {
		if (trend < 0) return `<:arrow_red:842824890918764544> ${trend}%`;
		else return `<:arrow_green:842824851072614487> +${trend}%`;
	},
	getStationIcon(stationTypeInt) {
		let type, priority;
		switch (parseInt(stationTypeInt)) {
			case 1:
			case 12:
			case 13:
				type =
					"<:coriolis:822765325350076426> Starport";
				priority = 1;
				break;
			case 3:
				type =
					"<:outpost:822765313870397460> Outpost";
				priority = 2;
				break;
			case 14:
			case 15:
				type =
					"<:surface:822765337548029962> Planetary port";
				priority = 3;
				break;
			default:
				type =
					"<:other:822765350536871946> Other";
				priority = 4;
				break;
		}
		return {type, priority};
	},
	parseStationData(rows) {
		let data = [];
		const rowsLength = rows.length
		for (let i = 0; i < rowsLength; i++) {
			let object = {};
			const links = rows[i].querySelectorAll("td a.inverse");

			object.system = links[1].textContent;
			object.stationName = links[0].textContent;

			const type = rows[i]
				.querySelector("td:first-child")
				.getAttribute("data-order");

			({type: object.type, priority: object.priority} = this.getStationIcon(type));

			data.push(object);
		}
		return data;
	},
	generateStationsEmbed(data) {
		const embed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setTitle(`ITRC Stations`)
			.setDescription(`[INARA](${inaraFactionUrl})\n${divider}`);

		data.forEach((outputEl) => {
			embed.addField(
				`${outputEl.system}`,
				`${divider}`
			);
			outputEl.stations.forEach(el => {
				embed.addField(
					`${el.name}`,
					`${el.type}`
				);
			});
			embed.addField(
				`\u200B`,
				`${divider}`
			);
		});

		return embed;
	},
	parseConflictsData(systemsPresent, tickTime) {
		let data = [];
		systemsPresent.forEach((system) => {
			if (system.conflicts.length == 0) return;

			let object = {};
			object.faction1 = {};
			object.faction2 = {};

			const conflict = system.system_details.conflicts[0];

			object.system = system.system_name;
			object.lastUpdate = moment.utc(system.updated_at);
			object.isUpdated = wasAfterTick(object.lastUpdate, tickTime);
			object.status = conflict.status;

			//read from conflict - print to object
			['name', 'stake', 'days_won'].forEach(prop => object.faction1[prop] = conflict.faction1[prop]);
			['name', 'stake', 'days_won'].forEach(prop => object.faction2[prop] = conflict.faction2[prop]);
			if (
				conflict.faction1.faction_id ===
				factionId
			)
				object.faction1.isItrc = true;
			else object.faction2.isItrc = true;

			data.push(object);
		});
		return data;
	},
	generateConflictsEmbed(data) {
		const embed = new Discord.MessageEmbed()
			.setColor(embedColor)
			.setTitle(`ITRC Conflicts`)
			.setDescription(`[INARA](${inaraFactionUrl})\n${divider}`);

			if (data.length == 0) {
				embed.addField(`Žiadne konflikty 🎉`, "\u200B");
			}
			else {
				data.forEach((conflict) => {
					if (conflict.faction1.isItrc)
						this.printConflict(embed, conflict.faction1, conflict.faction2, conflict);
					else
						this.printConflict(embed, conflict.faction2, conflict.faction1, conflict);
				});
			}

		return embed;
	},
	printConflict(embed, itrc, enemy, conflict)
	{
		embed.addField(
			`${divider}`,
			`**ITRC vs ${enemy.name}**\n<:system:822765748111671326> ${conflict.system}`
		);
		if (conflict.status === "pending")
			embed.addField(`\`pending\``, "\u200B", true);
		else
			embed.addField(
				`\`${itrc.days_won} vs ${enemy.days_won}\``,
				"\u200B",
				true
			);

		embed.addField(
			`🏆 ${enemy.stake || ' ---'}`,
			`💥 ${itrc.stake || ' ---'}`,
			true
		);
		embed.addField(`\u200B`, `${conflict.lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')} ${conflict.isUpdated ? `✅` : `❌`}`)
	},
	parseSystemsData(systemsPresent) {
		let data = [];
		systemsPresent.forEach((system) => {
			let object = {};
			object.system = system.system_name;
			object.realInfluence = system.influence;
			object.influence =
				Math.round(system.influence * 1000) / 10;
			object.lastUpdate = moment.utc(system.updated_at);

			object.population = this.addSuffixToInt(
				system.system_details.population
			);
			object.trend = 0;
			object.isUpdated = false;
			data.push(object);
		});

		//sort by influence
		data.sort((a, b) => {
			if (a.influence < b.influence) return 1;
			if (a.influence > b.influence) return -1;
			return 0;
		});
		return data;
	},
	generateSystemsEmbed(data) {
		const embed = new Discord.MessageEmbed()
		.setColor(embedColor)
		.setTitle(`ITRC Systems`)
		.setDescription(`[INARA](${inaraFactionUrl})\n${divider}`);

		data.forEach((el) => {
			embed.addField(
				`${el.influence.toFixed(1)}% - ${this.printTrend(
					el.trend
				)} - ${el.system} - 🙍‍♂️ ${el.population}`,
				` ${el.isUpdated ? `✅` : `❌`} \u200B${el.lastUpdate.tz("Europe/Berlin").from(moment.tz("Europe/Berlin"))}`
			);
		});

		return embed;
	}
};
