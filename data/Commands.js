const Discord = require('discord.js')
const fs = require('fs')

let _client

exports.initCommands = (client) => {
	_client = client
	const commands = new Discord.Collection()
	const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'))
	commandFiles.forEach((file) => {
		// eslint-disable-next-line import/no-dynamic-require
		const command = require(`../commands/${file}`)

		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
		commands.set(command.name, command)
	})
	commands.sort((a, b) => {
		if (a.name < b.name) {
			return -1
		}
		if (a.name > b.name) {
			return 1
		}
		return 0
	})
	return commands
}

exports.getCommands = () => _client?.commands
