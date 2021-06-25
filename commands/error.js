function displayError(text, discordMessage) {
	return discordMessage.channel.send(`${text}, ${discordMessage.author}!`);
}

module.exports = { displayError };
