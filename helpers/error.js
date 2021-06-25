function replyError(text, discordMessage) {
	return discordMessage.channel.reply(`${text}`);
}

function displayError(text, discordMessage) {
	return discordMessage.channel.send(`${text}, ${discordMessage.author}!`);
}

function systemError(systemName, discordMessage) {
	return discordMessage.channel.send(`Systém ${systemName} neexistuje, ${discordMessage.author}!`);
}

function argsError(discordMessage) {
	return discordMessage.channel.send(`Zlý počet argumentov, ${discordMessage.author}!`);
}

module.exports = { replyError, displayError, systemError, argsError };
