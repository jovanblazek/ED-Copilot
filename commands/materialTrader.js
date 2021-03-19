const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const Discord = require("discord.js");

module.exports = {
	name: "trader",
	description: "Vypíše 5 najbližších Material Traderov",
	async execute(message, args) {
		try {
			if (!args.length || args.length > 5)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);
			
			let systemName = '', systemNameWeb = '';
			for (let i = 0; i < args.length; i++) {
				systemName += (args[i].toLowerCase() + ' ');
				systemNameWeb += (args[i].toLowerCase() + '%20');
			}

			let url = `https://inara.cz/nearest-stations/?ps1=${systemNameWeb}&pi13=&pi14=0&pi15=0&pi16=&pi1=0&pi18=0&pi19=0&pa1%5B25%5D=1&pi8=&pi9=0&pi3=&pi4=0&pi5=0&pi6=0&pi7=0&pi23=0`;

			const output = await got(url)
				.then((response) => {
					let data = [];

					const dom = new JSDOM(response.body);
					const row = dom.window.document.querySelectorAll("tr");
					if (row.length == 0)
						return message.channel.send(
							`Systém ${systemName} neexistuje, ${message.author}!`
						);

					for (let i = 1; i < 6; i++) {
						let object = {};
						const links = row[i].querySelectorAll("td a.inverse");

						let j = 0;
						links.forEach((element) => {
							if (j == 0) object.station = element.textContent;
							else object.system = element.textContent;
							j++;
						});

						const distance = row[i].querySelector("td:last-child");
						if (distance != null) {
							object.distanceLs = distance.previousElementSibling.textContent;
							object.distance = distance.textContent;
						}

						const type = row[i].querySelector("td:first-child");
						if (type != null) object.type = type.textContent;

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
					.setTitle("Material Traders");

				output.forEach((el) => {
					outputEmbed.addField(
						`${el.type} - ${el.system}`,
						`${el.station} - ${el.distanceLs}\n\`${el.distance}\`\n`
					);
				});

				message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
};
