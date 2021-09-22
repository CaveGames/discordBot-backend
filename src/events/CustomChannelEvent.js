// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const config = require('../../slappey.json');

const { Permissions } = require('discord.js');
const CustomChannels = require('../utils/sequelize/models/CustomChannels');

module.exports = {
	name: 'voiceStateUpdate',

	async run(client, oldState, newState) {
		if (oldState.channelId == newState.channelId) return;

		var customChannel = await CustomChannels.findOne({ where: { channelId: oldState.channelId } });
		if (customChannel) {
			const channel = oldState.guild.channels.cache.get(customChannel.channelId);

			if (channel.members.size == 0) {
				channel.delete();

				CustomChannels.destroy({ where: { id: customChannel.id } });
			}
		}

		if (newState.channelId == config.customChannels.channelId) {
			const member = newState.guild.members.cache.get(newState.id);

			const channel = await newState.guild.channels.create('Talk: ' + member.user.username, {
				type: 'GUILD_VOICE',
				parent: config.customChannels.categoryId,
				permissionOverwrites: [
					{
						id: member.user.id,
						allow: [
							Permissions.FLAGS.MANAGE_CHANNELS,
							Permissions.FLAGS.CONNECT,
							Permissions.FLAGS.MUTE_MEMBERS,
							Permissions.FLAGS.DEAFEN_MEMBERS
						]
					}
				]
			});

			CustomChannels.create({
				userId: member.user.id,
				channelId: channel.id
			});

			member.voice.setChannel(channel);
		}
	}
};
