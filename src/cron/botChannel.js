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

	init();
}

async function init() {
	const guild = global.client.guilds.cache.get(config.guildId);
	const channel = guild.channels.cache.get(config.botChannelId);

	channel.send({
		embeds: [
			{
				title: 'Befehlige deine Untertanen',
				description:
					'Über Nachrichten in diesem Channel kannst du die Bots befehligen.\n\n' +
					'**Musik-Bot**\n' +
					'**► `m!help`**\n' +
					'Sehe alle Befehle für den _Dicken fetten Jens_, unseren Musik-Bot.\n\n' +
					'**Custom Channels**\n' +
					'**► `!cc`**\n' +
					'Lasse dir Infos über den aktuellen Custom Channel anzeigen.\n\n' +
					'**► `!cc private|public`**\n' +
					'Schalte den aktuellen Custom Channel auf privat oder öffentlich.\n\n' +
					'**► `!cc hide|show`**\n' +
					'Mache den aktuellen Custom Channel (un)sichtbar.\n\n' +
					'**► `!cc kick <@Benutzer>`**\n' +
					'Werfe einen Nutzer aus dem Custom Channel.\n\n' +
					'**► `!cc ban|unban`**\n' +
					'(Ent)banne einen Benutzer in dem Custom Channel.\n\n',
				color: config.accentColor,
			},
		],
	});
}

module.exports = { clear, init };
