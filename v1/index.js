require('dotenv').config()
const Discord = require('discord.js')
const { prefix } = require('./config.json')
const { displayError } = require('./utils/error')
const { getRandomActivity, init, tickDetector } = require('./utils')
const { initCommands } = require('./data/Commands')

const client = new Discord.Client()
client.commands = initCommands(client)

client.once('ready', async () => {
	await init()
	client.user.setPresence(getRandomActivity())
	console.log('Bot is online')
	tickDetector(client)

	// Change status every hour
	setInterval(() => {
		client.user.setPresence(getRandomActivity())
	}, 1000 * 60 * 60)
})

client.on('message', async (message) => {
	if (message.author.bot || !message.content.startsWith(prefix)) return

	const commandBody = message.content.slice(prefix.length)
	const args = commandBody.split(' ')
	const commandName = args.shift().toLowerCase()

	if (!client.commands.has(commandName)) return

	try {
		client.commands.get(commandName).execute(message, args)
	} catch (error) {
		console.error('Index error handler\n\n', error)
		displayError('Pri vykonávaní príkazu sa vyskytla chyba!', message)
	}
})

client.login(process.env.BOT_TOKEN)
