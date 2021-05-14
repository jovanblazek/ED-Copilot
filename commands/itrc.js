const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Discord = require("discord.js");
const { divider } = require("../config.json");
const moment = require("moment");
const momenttz = require("moment-timezone");
const config = require("../config.json");
moment.locale("sk");

module.exports = {
	name: "itrc",
	description: "Vypíše konflikty ITRC",
	url: "https://inara.cz/minorfaction/77953/",
	conflictsUrl:
		"https://elitebgs.app/api/ebgs/v5/factions?eddbId=76911&systemDetails=true",
	systemsUrl:
		"https://elitebgs.app/api/ebgs/v5/factions?eddbId=76911&systemDetails=true&count=2",
	execute(message, args) {
		try {
			if (!args.length || args.length > 1)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);

			if (args[0] === "conflicts") this.conflicts(message);
			else if (args[0] === "stations") this.stations(message);
			else if (args[0] === "systems") this.systems(message);
			else {
				message.channel.send(
					`Neznámy argument ${args[0]}, ${message.author}!`
				);
			}
		} catch (error) {
			console.log(error);
		}
	},
	async conflicts(message) {
		try {
			const output = await got(this.conflictsUrl)
				.then((response) => {
					let data = [];
					const resJson = JSON.parse(response.body);
					const presence = resJson.docs[0].faction_presence;

					presence.forEach((system) => {
						if (system.conflicts.length == 0) return;

						let object = {};
						object.faction1 = {};
						object.faction2 = {};

						const conflict = system.system_details.conflicts[0];

						object.system = system.system_name;
						object.lastUpdate = moment.utc(system.updated_at);
						object.status = conflict.status;

						object.faction1.name = conflict.faction1.name;
						object.faction1.stake = conflict.faction1.stake;
						object.faction1.days_won = conflict.faction1.days_won;

						object.faction2.name = conflict.faction2.name;
						object.faction2.stake = conflict.faction2.stake;
						object.faction2.days_won = conflict.faction2.days_won;

						if (
							conflict.faction1.faction_id ===
							"5d646fde07dcf10d3e908300"
						)
							object.faction1.isItrc = true;
						else object.faction2.isItrc = true;

						data.push(object);
					});

					return data;
				})
				.catch((err) => {
					console.log(err);
				});

			if (output != null || output != undefined) {
				const outputEmbed = new Discord.MessageEmbed()
					.setColor("#ffa500")
					.setTitle("ITRC Conflicts")
					.setDescription(
						`[INARA](https://inara.cz/minorfaction/77953/)`
					);

				if (output.length == 0) {
					outputEmbed.addField(`Žiadne konflikty 🎉`, "\u200B");
				}
				else {
					output.forEach((el) => {
						if (el.faction1.isItrc)
							this.printConflicts(outputEmbed, el.faction1, el.faction2, el);
						else
							this.printConflicts(outputEmbed, el.faction2, el.faction1, el);
					});
				}

				message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
	async stations(message) {
		try {
			const output = await got(this.url)
				.then((response) => {
					let data = [];

					const dom = new JSDOM(response.body);
					const row = dom.window.document.querySelectorAll(
						".maincontent1 > div.maintable table tbody tr"
					);

					if (row.length == 0)
						return message.channel.send(`Žiadne stanice`);

					for (let i = 0; i < row.length; i++) {
						let object = {};
						const links = row[i].querySelectorAll("td a.inverse");

						object.system = links[1].textContent;
						object.stationName = links[0].textContent;

						const type = row[i]
							.querySelector("td:first-child")
							.getAttribute("data-order");

						switch (parseInt(type)) {
							case 1:
							case 12:
							case 13:
								object.type =
									"<:coriolis:822765325350076426> Starport";
								break;
							case 3:
								object.type =
									"<:outpost:822765313870397460> Outpost";
								break;
							case 14:
							case 15:
								object.type =
									"<:surface:822765337548029962> Planetary port";
								break;
							default:
								object.type =
									"<:other:822765350536871946> Other";
								break;
						}
						data.push(object);
					}

					data.sort((a, b) => {
						const systemA = a.system.toUpperCase();
						const systemB = b.system.toUpperCase();

						let comparison = 0;
						if (systemA > systemB) comparison = 1;
						else if (systemA < systemB) comparison = -1;

						return comparison;
					});

					return data;
				})
				.catch((err) => {
					console.log(err);
				});

			if (output != null || output != undefined) {
				const outputEmbed = new Discord.MessageEmbed()
					.setColor("#ffa500")
					.setTitle("ITRC Stations")
					.setDescription(
						`[INARA](https://inara.cz/minorfaction/77953/)\n${divider}`
					);

				output.forEach((el) => {
					outputEmbed.addField(
						`${el.system} - ${el.stationName}`,
						`${el.type}`
					);
				});

				message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
	async systems(message, client = null) {
		try {
			got(this.systemsUrl)
				.then(async (response) => {
					let data = [];
					const resJson = JSON.parse(response.body);

					const systems = resJson.docs[0].faction_presence;
					systems.forEach((system) => {
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

					data.sort(this.sortByInfluence);
					this.calculateInfluenceHistory(
						data,
						resJson.docs[0].history
					);
					
					await this.getTickTime()
					.then((tt) => {
						const tickTime = tt.tz("Europe/Berlin")
						for (let i = 0; i < data.length; i++)
						{
							let difference = (((data[i].lastUpdate)-tickTime)/1000)/60
							if(difference > 0)
								data[i].isUpdated = true;
							else
								data[i].isUpdated = false;
						}
					})

					return data;
				})
				.then((output) => {
					const outputEmbed = new Discord.MessageEmbed()
						.setColor("#ffa500")
						.setTitle("ITRC Systems")
						.setDescription(
							`[INARA](https://inara.cz/minorfaction/77953/)\n${divider}`
						);

					output.forEach((el) => {
						outputEmbed.addField(
							`${el.influence.toFixed(1)}% - ${this.printTrend(
								el.trend
							)} - ${el.system} - 🙍‍♂️ ${el.population}`,
							` ${el.isUpdated ? `✅` : `❌`} \u200B${el.lastUpdate
								.tz("Europe/Berlin")
								.from(moment.tz("Europe/Berlin"))}`
						);
					});

					if (client != null)
						client.channels.cache
							.get(config.tickReportChannel)
							.send({ embed: outputEmbed });
					else message.channel.send({ embed: outputEmbed });
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
	addSuffixToInt(value) {
		var suffixes = ["", "k", "m", "b", "t"];
		var suffixNum = Math.floor(("" + value).length / 3);
		var shortValue = parseFloat(
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
	sortByInfluence(a, b) {
		if (a.influence < b.influence) return 1;
		if (a.influence > b.influence) return -1;
		return 0;
	},
	calculateInfluenceHistory(data, history) {
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < history.length; j++) {
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
	printConflicts(outputEmbed, itrc, enemy, data)
	{
		outputEmbed.addField(
			`${divider}`,
			`**ITRC vs ${enemy.name}**\n<:system:822765748111671326> ${data.system}`
		);
		if (data.status === "pending")
			outputEmbed.addField(`\`pending\``, "\u200B", true);
		else
			outputEmbed.addField(
				`\`${itrc.days_won} vs ${enemy.days_won}\``,
				"\u200B",
				true
			);

		outputEmbed.addField(
			`🏆 ${enemy.stake || ' ---'}`,
			`💥 ${itrc.stake || ' ---'}`,
			true
		);
		outputEmbed.addField(`\u200B`, `${data.lastUpdate.tz('Europe/Berlin').format('DD.MM.YYYY HH:mm')}`)
	},
	async getTickTime() {
		try {
			let timeToday = Math.floor(new Date().getTime() / 1000.0);
			let timeYesterday = new Date();
			timeYesterday.setDate(timeYesterday.getDate() - 2);
			timeYesterday = Math.floor(timeYesterday.getTime() / 1000.0);

			let url = `https://elitebgs.app/api/ebgs/v5/ticks?timeMin=${timeYesterday}000&timeMax=${timeToday}000`;

			return await got(url)
				.then((response) => {
					if (response.body.length == 2) return;

					const resJson = JSON.parse(response.body);
					return (date = moment.utc(resJson[0].time));
				})
				.catch((err) => {
					console.log(err);
				});
		} catch (error) {
			console.log(error);
		}
	},
};
