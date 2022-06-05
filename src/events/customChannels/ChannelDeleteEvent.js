// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
const { CustomChannels } = require('../../database').models;

module.exports = {
	name: 'channelDelete',

	async run(client, channel) {
		if (channel.type == 'GUILD_VOICE') {
			const customChannel = await CustomChannels.findOne({
				where: {
					guildId: channel.guild.id,
					voiceChannelId: channel.id,
				},
			});

			if (customChannel) {
				const textChannel = channel.guild.channels.cache.get(customChannel.textChannelId);
				if (textChannel) {
					textChannel.delete();
				}

				customChannel.destroy();
			}
		}
		else if (channel.type == 'GUILD_TEXT') {
			const customChannel = await CustomChannels.findOne({
				where: {
					guildId: channel.guild.id,
					textChannelId: channel.id,
				},
			});

			if (customChannel) {
				customChannel.update({
					textChannelId: null,
				});
			}
		}
	},
};
