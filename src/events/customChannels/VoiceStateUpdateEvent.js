// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const config = require('../../../config.json');

const { Permissions } = require('discord.js');
const { CustomChannels, UserData } = require('../../database').models;

module.exports = {
	name: 'voiceStateUpdate',

	async run(client, oldState, newState) {
		if (oldState.channelId == newState.channelId) return;

		const customChannel = await CustomChannels.findOne({
			where: { guildId: oldState.guild.id, channelId: oldState.channelId },
		});
		if (customChannel) {
			const channel = oldState.guild.channels.cache.get(customChannel.channelId);

			if (!channel) {
				return;
			}

			if (channel.members.size == 0) {
				channel.delete();

				customChannel.destroy();
			}
		}

		if (newState.channelId == config.customChannels.channelId) {
			const member = newState.guild.members.cache.get(newState.id);
			const userData = await UserData.findOne({
				where: {
					guildId: newState.guild.id,
					userId: member.user.id,
				},
			});

			const channel = await newState.guild.channels.create('Talk: ' + member.user.username, {
				type: 'GUILD_VOICE',
				parent: config.customChannels.categoryId,
				permissionOverwrites: [
					{
						id: member.user.id,
						allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT],
					},
				],
			});

			CustomChannels.create({
				guildId: newState.guild.id,
				channelId: channel.id,
				ownerId: userData.id,
			});

			member.voice.setChannel(channel);
		}
	},
};
