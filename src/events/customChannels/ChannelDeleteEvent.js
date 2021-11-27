// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
const { CustomChannels } = require('../../database').models;

module.exports = {
	name: 'channelDelete',

	async run(client, channel) {
		const customChannel = await CustomChannels.findOne({
			where: {
				guildId: channel.guild.id,
				channelId: channel.id,
			},
		});

		if (customChannel) {
			customChannel.destroy();
		}
	},
};
