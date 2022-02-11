const config = require('../../../config.json');

module.exports = {
	name: 'voiceStateUpdate',

	async run(client, oldState, newState) {
		if (oldState.channelId == newState.channelId) return;

		if (newState.channelId == config.live.voiceChannelId) {
			const channel = newState.guild.channels.cache.get(config.live.voiceChannelId);

			channel.permissionOverwrites.edit(newState.guild.roles.everyone.id, { VIEW_CHANNEL: true });
		}
		else if (oldState.channelId == config.live.voiceChannelId) {
			const channel = newState.guild.channels.cache.get(config.live.voiceChannelId);

			if (channel.members.size == 0) {
				channel.permissionOverwrites.edit(newState.guild.roles.everyone.id, { VIEW_CHANNEL: false });
			}
		}
	},
};
