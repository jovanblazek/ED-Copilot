const got = require("got");
const Discord = require("discord.js");
const moment = require("moment");
const momenttz = require("moment-timezone");
const config = require("../config.json");
moment.locale("sk");

module.exports = {
	name: "tick",
	description: "Vypíše dátum a čas posledného ticku",
	async execute(message, args, client = null) {
		try {
			if (args.length > 0)
				return message.channel.send(`Zlý počet argumentov, ${message.author}!`);

			let timeToday = Math.floor(new Date().getTime() / 1000.0);
			let timeYesterday = new Date();
			timeYesterday.setDate(timeYesterday.getDate() - 2);
			timeYesterday = Math.floor(timeYesterday.getTime() / 1000.0);

			let url = `https://elitebgs.app/api/ebgs/v5/ticks?timeMin=${timeYesterday}000&timeMax=${timeToday}000`;

			const output = await got(url)
				.then((response) => {
					if (response.body.length == 2) {
						if (message != null)
							return message.channel.send(`Nastala chyba pri vykonávaní príkazu.`);
					}

					const resJson = JSON.parse(response.body);
					return (date = moment.utc(resJson[0].time));
				})
				.catch((err) => {
					console.log(err);
				});

			const difference = output.tz("Europe/Berlin").from(moment.tz("Europe/Berlin"));
			const wasToday = output.tz("Europe/Berlin").date() == moment.tz("Europe/Berlin").date();

			if (output != null || output != undefined) {
				const outputEmbed = new Discord.MessageEmbed()
					.setColor("#ffa500")
					.setTitle(`Posledný TICK`)
					.setDescription(
						`**${output.tz("Europe/Berlin").format("DD.MM.YYYY HH:mm")}**
                        ${difference}\n
                        Dnes: ${wasToday ? "✅" : "❌"}\n
                        [HISTÓRIA](https://elitebgs.app/tick)`
					);

				if (client != null)
					client.channels.cache
						.get(config.tickReportChannel)
						.send({ embed: outputEmbed });
				else message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
	async checkTick(client) {
		try {
			let timeToday = Math.floor(new Date().getTime() / 1000.0);
			let timeYesterday = new Date();
			timeYesterday.setDate(timeYesterday.getDate() - 2);
			timeYesterday = Math.floor(timeYesterday.getTime() / 1000.0);

			let url = `https://elitebgs.app/api/ebgs/v5/ticks?timeMin=${timeYesterday}000&timeMax=${timeToday}000`;

			const output = await got(url)
				.then((response) => {
					if (response.body.length == 2) return;

					const resJson = JSON.parse(response.body);
					return (date = moment.utc(resJson[0].time));
				})
				.catch((err) => {
					console.log(err);
				});

			const wasToday = output.tz("Europe/Berlin").date() == moment.tz("Europe/Berlin").date();

			if (wasToday) {
				let difference = output.tz("Europe/Berlin") - moment.tz("Europe/Berlin");
				difference = Math.abs(((difference/1000)/60)/60);
				console.log("Last tick: "+difference+" hours ago.");
				if(difference < 1)
				{
					client.commands.get("tick").execute(null, [], client);
					client.commands.get("itrc").systems(null, client);
				}
			}
			return;
		} catch (error) {
			console.log(error);
		}
	},
};
