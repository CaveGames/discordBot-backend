const { Permissions } = require('discord.js');
const CustomChannels = require('../utils/sequelize/models/CustomChannels');

module.exports = {
	command: 'cc',

	async run(client, message, args) {
		const member = message.guild.members.cache.get(message.author.id);
		const customChannel = await CustomChannels.findOne({
			where: { guildId: message.guild.id, channelId: member.voice.channelId }
		});
		const channel = message.guild.channels.cache.get(customChannel.channelId);

		if (!customChannel) {
			message.reply('Connect to a custom Channel first');
			return;
		}

		if (args[0] == 'private' || args[0] == 'public') {
			if (customChannel.userId != member.user.id) {
				message.reply('Not your Channel!');
				return;
			}

			if (customChannel.isPrivateChannel) {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: null });
				CustomChannels.update(
					{ isPrivateChannel: false, isHidden: false },
					{ where: { id: customChannel.id } }
				);
				message.reply('Set to public');
			} else {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: false });
				CustomChannels.update({ isPrivateChannel: true }, { where: { id: customChannel.id } });
				message.reply('Set to private');
			}
		} else if (args[0] == 'hide' || args[0] == 'show') {
			if (customChannel.userId != member.user.id) {
				message.reply('Not your Channel!');
				return;
			}

			if (customChannel.isHidden) {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { VIEW_CHANNEL: null });
				CustomChannels.update({ isHidden: false }, { where: { id: customChannel.id } });
				message.reply('Set to shown');
			} else {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { VIEW_CHANNEL: false });
				CustomChannels.update({ isHidden: true }, { where: { id: customChannel.id } });
				message.reply('Set to hidden');
			}
		} else {
			message.reply('Unknown Command');
		}
	}
};
