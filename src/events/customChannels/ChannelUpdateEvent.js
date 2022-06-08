// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
const { CustomChannels } = require('../../database').models;

module.exports = {
	name: 'channelUpdate',

	async run(client, oldChannel, newChannel) {
		if (oldChannel.type != 'GUILD_VOICE') return;

		const customChannel = await CustomChannels.findOne({
			where: {
				guildId: oldChannel.guild.id,
				voiceChannelId: oldChannel.id,
			},
		});

		if (!customChannel) return;
		if (oldChannel.name == newChannel.name) return;

		const textChannel = oldChannel.guild.channels.cache.get(customChannel.textChannelId);
		if (!textChannel) return;

		textChannel.edit({ name: newChannel.name });
	},
};
