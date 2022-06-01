const config = require('../../config.json');

async function clear() {
	const guild = global.client.guilds.cache.get(config.guildId);
	const channel = guild.channels.cache.get(config.botChannelId);

	let messages = await channel.messages.fetch();

	if (messages.size == 0) return;

	while (messages.size > 0) {
		if (messages.size == 1) {
			messages.forEach(msg => msg.delete());
			break;
		}
		channel.bulkDelete(100);
		messages = channel.messages.fetch();
	}
}

async function initClear() {
	const guild = global.client.guilds.cache.get(config.guildId);
	const channel = guild.channels.cache.get(config.botChannelId);

	const messages = await channel.messages.fetch();
	messages.forEach(msg => msg.delete());
}

module.exports = { clear, initClear };
