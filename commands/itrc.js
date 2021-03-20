const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Discord = require("discord.js");
const {divider} = require("../config.json");

module.exports = {
	name: "itrc",
	description: "Vypíše konflikty ITRC",
	url: "https://inara.cz/minorfaction/77953/",
	execute(message, args) {
		try {
			if (!args.length || args.length > 1)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);

			if (args[0] === "conflicts") this.conflicts(message);
			else if (args[0] === "stations") this.stations(message);
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
			const output = await got(this.url)
				.then((response) => {
					let data = [];

					const dom = new JSDOM(response.body);
					const row = dom.window.document.querySelectorAll(
						".switchtabs > div:last-child table tbody tr"
					);

					if (row.length == 0)
						return message.channel.send(`Žiadne aktívne konflikty`);

					for (let i = 0; i < row.length; i++) {
						let object = {};
						const links = row[i].querySelectorAll(
							"td:first-child a.inverse"
						);

						object.enemy = links[0].textContent;
						object.system = links[1].textContent;

						const assets = row[i].querySelector(
							"td:first-child .minor.smaller"
						);
						if (assets != null) {
							object.assetWin =
								assets.lastElementChild.textContent;
							object.asseetLose =
								assets.nextElementSibling.nextElementSibling.lastElementChild.textContent;
						}

						const status = row[i].querySelector("td:nth-child(2)");
						object.score = status.querySelector(
							"span:first-child"
						).textContent;
						object.scoreEnemy = status.querySelector(
							"span:nth-child(3)"
						).textContent;
						object.state = status.querySelector(
							"span:last-child"
						).textContent;

						data.push(object);
					}

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

				output.forEach((el) => {
					outputEmbed.addField(`${divider}`, '\u200B');
					outputEmbed.addField(
						`ITRC vs ${el.enemy}`,
						`<:system:822765748111671326> ${el.system}`
					);
					outputEmbed.addField(`\`${el.score} vs ${el.scoreEnemy} (${el.state})\``, '\u200B', true);
					outputEmbed.addField(`🏆 ${el.assetWin}`, `💥 ${el.asseetLose}`, true);
					
				});

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
};
