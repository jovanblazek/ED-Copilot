const Discord = require('discord.js')
const { embedColor } = require('../config.json')

exports.createEmbed = ({ title = 'Title', description = '', footer = '' }) => {
	return new Discord.MessageEmbed()
		.setColor(embedColor)
		.setTitle(title)
		.setDescription(description)
		.setFooter(footer)
}
