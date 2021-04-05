const got = require("got");
const Discord = require("discord.js");

module.exports = {
	name: "tick",
	description: "Vypíše dátum a čas posledného ticku",
	async execute(message, args) {
		try {
			if (args.length > 0)
				return message.channel.send(
					`Zlý počet argumentov, ${message.author}!`
				);

			let timeToday = Math.floor(new Date().getTime() / 1000.0);
			let timeYesterday = new Date();
			timeYesterday.setDate(timeYesterday.getDate() - 2);
			timeYesterday = Math.floor(timeYesterday.getTime() / 1000.0);

			let url = `https://elitebgs.app/api/ebgs/v5/ticks?timeMin=${timeYesterday}000&timeMax=${timeToday}000`;

			const output = await got(url)
				.then((response) => {
					if (response.body.length == 2)
						return message.channel.send(
							`Nastala chyba pri vykonávaní príkazu.`
						);

					const resJson = JSON.parse(response.body);
					return resJson[0].time;
				})
				.catch((err) => {
					console.log(err);
				});

			const timeNow = new Date();
            const tickTime = new Date(output);
            const difference = Math.floor((timeNow - tickTime) / (3600*1000));
            const wasToday = tickTime.getDate() == timeNow.getDate();

			if (output != null || output != undefined) {
				const outputEmbed = new Discord.MessageEmbed()
					.setColor("#ffa500")
					.setTitle(`Posledný TICK`)
					.setDescription(
						`**${this.parseISOString(output)}**
                        Pred ${difference}h\n
                        Dnes: ${wasToday ? '✅' : '❌'}\n
                        [HISTÓRIA](https://elitebgs.app/tick)`
					);

				message.channel.send({ embed: outputEmbed });
			}
		} catch (error) {
			console.log(error);
		}
	},
	parseISOString(isoDate) {
		date = new Date(isoDate);
		year = date.getFullYear();
		month = date.getMonth() + 1;
		dt = date.getDate();
		hour = date.getHours();
		minute = date.getMinutes();

		if (dt < 10) dt = "0" + dt;
		if (month < 10) month = "0" + month;
		if (hour < 10) hour = "0" + hour;
		if (minute < 10) minute = "0" + minute;

		return `${dt}.${month}.${year} ${hour}:${minute}`;
	},
};
