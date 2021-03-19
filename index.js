const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config.json");
const fetch = require("node-fetch");
const got = require("got");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const prefix = config.prefix;
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}


client.once("ready", () => {
	console.log("bot is online");

	client.user.setPresence({
		status: "online",
		activity: {
			name: `${prefix}help`,
			type: "PLAYING",
		},
	});
});

client.on("message", async function (message) {
	if (message.author.bot || !message.content.startsWith(prefix)) return;

	const commandBody = message.content.slice(prefix.length);
	const args = commandBody.split(" ");
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	try {
		client.commands.get(commandName).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply("Pri vykonávaní príkazu sa vyskytla chyba!");
	}
});

client.login(config.BOT_TOKEN);
