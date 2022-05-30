const config = require('../../config.json');

async function clear() {
	const guild = global.client.guilds.cache.get(config.guildId);
	const channel = guild.channels.cache.get(config.botChannelId);

	let messages = await channel.messages.fetch();

	if (messages.size == 0) return;

	while (messages.size > 0) {
		if (messages.size == 1) {
			messages[0].delete();
			break;
		}
		channel.bulkDelete(100);
		messages = channel.messages.fetch();
	}
}

module.exports = { clear };
