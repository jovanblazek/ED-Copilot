/* Not working in discord-js v12
	function replyError(text, discordMessage) {
		return discordMessage.channel.reply(`${text}`)
	}
*/

function displayError(text, discordMessage) {
	return discordMessage.channel.send(`${text}, ${discordMessage.author}!`)
}

function systemError(systemName, discordMessage) {
	return discordMessage.channel.send(`Systém ${systemName} neexistuje, ${discordMessage.author}!`)
}

function argsError(discordMessage) {
	return discordMessage.channel.send(`Zlý počet argumentov, ${discordMessage.author}!`)
}

function tickError(discordMessage) {
	return discordMessage.channel.send(
		`Nepodarilo sa získať informácie o ticku.\nSkontroluj https://elitebgs.app/tick`
	)
}

module.exports = { displayError, systemError, argsError, tickError }
