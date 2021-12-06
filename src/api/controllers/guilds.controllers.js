const config = require('../../../config.json');

const SendMessage = async (req, res) => {
	if (!req.params.guildId || !req.params.channelId) {
		res.status(404).json({});
		return;
	}

	const guild = global.client.guilds.cache.get(req.params.guildId);
	const channel = guild.channels.cache.get(req.params.channelId);

	channel.send(req.body);

	res.status(200).json({});
};

module.exports = {
	SendMessage,
};
