require('dotenv').config()
const Discord = require('discord.js')
const { prefix } = require('./config.json')
const { replyError } = require('./helpers/error')
const { getRandomActivity } = require('./helpers/activityChanger')
const { init } = require('./helpers/init')
const { initCommands } = require('./data/Commands')

const client = new Discord.Client()
client.commands = initCommands(client)

client.once('ready', async () => {
	await init()
	client.user.setPresence(getRandomActivity())
	console.log('Bot is online')

	// Change status every hour and check for tick
	setInterval(() => {
		client.user.setPresence(getRandomActivity())

		console.log('Cheking tick')
		client.commands.get('tick').checkTick(client)
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
		console.error(error)
		replyError('Pri vykonávaní príkazu sa vyskytla chyba!', message)
	}
})

client.login(process.env.BOT_TOKEN)
