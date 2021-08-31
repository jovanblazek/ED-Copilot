require('dotenv').config()
const fs = require('fs')
const Discord = require('discord.js')
const { prefix } = require('./config.json')
const { replyError } = require('./helpers/error')
const { getRandomActivity } = require('./helpers/activityChanger')
const { init } = require('./helpers/init')

const client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))
commandFiles.forEach((file) => {
	// eslint-disable-next-line import/no-dynamic-require
	const command = require(`./commands/${file}`)

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command)
})

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
