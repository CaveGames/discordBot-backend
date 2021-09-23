const { Permissions } = require('discord.js');
const CustomChannels = require('../utils/sequelize/models/CustomChannels');

module.exports = {
	command: 'cc',

	async run(client, message, args) {
		if (args[0] == 'private') {
			const member = message.guild.members.cache.get(message.author.id);
			const customChannel = await CustomChannels.findOne({
				where: { guildId: message.guild.id, channelId: member.voice.channelId }
			});
			if (customChannel) {
				if (customChannel.userId != member.user.id) {
					message.reply('Not your Channel!');
					return;
				}
				const channel = message.guild.channels.cache.get(customChannel.channelId);

				if (customChannel.isPrivateChannel) {
					channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: null });
					CustomChannels.update({ isPrivateChannel: false }, { where: { id: customChannel.id } });
					message.reply('Set to public');
				} else {
					channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: false });
					CustomChannels.update({ isPrivateChannel: true }, { where: { id: customChannel.id } });
					message.reply('Set to private');
				}
			} else {
				message.reply('Connect to a custom Channel first');
			}
		} else {
			message.reply('Unknown Command');
		}
	}
};
