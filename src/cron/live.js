const TwitchApi = require('node-twitch').default;

const config = require('../../config.json');

const twitch = new TwitchApi({
	client_id: config.live.clientId,
	client_secret: config.live.clientSecret,
});

async function cleanup() {
	const guild = global.client.guilds.cache.get(config.guildId);
	const channel = guild.channels.cache.get(config.live.notificationChannelId);

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

async function checkForStreams() {
	if (config.live.channels.length == 0) return;

	try {
		const streams = await twitch.getStreams({ channels: config.live.channels });
		if (streams.data.length <= 0) return;

		streams.data.forEach(stream => {
			sendLiveMessage(stream);
		});
	}
	catch (e) {
		console.log('Error checking for Streams');
	}
}

async function sendLiveMessage(stream) {
	console.log(stream);
	if (stream.type != 'live') return;

	const unixTime = Date.parse(stream.started_at);
	if (Date.now() - 1000 * 60 > unixTime) return;

	const users = await twitch.getUsers(stream.user_id);
	const user = users.data[0];

	const games = await twitch.getGames(stream.game_id);
	const game = games.data[0];

	const guild = global.client.guilds.cache.get(config.guildId);
	const channel = guild.channels.cache.get(config.live.notificationChannelId);

	const message = await channel.send({
		content: `Gucke ${user.display_name} jetzt Live auf Twitch! @here`,
		embeds: [
			{
				author: {
					name: `${user.display_name} ist nun Live!`,
					icon_url: user.profile_image_url,
				},
				title: stream.title,
				url: `https://twitch.tv/${stream.user_name}/`,
				description: `Streamt ${stream.game_name}\n[Jetzt zugucken](https://twitch.tv/${stream.user_name}/)`,
				thumbnail: {
					url: `https://static-cdn.jtvnw.net/ttv-boxart/${game.id}.jpg`,
				},
				image: {
					url: stream.getThumbnailUrl(),
				},
			},
		],
	});

	setTimeout(() => {
		if (!message.deleted) message.delete();
	}, 1000 * 60 * 12);
}

module.exports = { cleanup, checkForStreams };
