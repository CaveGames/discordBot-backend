const CustomChannels = require('../../utils/sequelize/models/CustomChannels');

module.exports = {
	command: 'ccprivate',

	async run(client, message, args) {
		const member = message.guild.members.cache.get(message.author.id);
		const customChannel = await CustomChannels.findOne({ where: { channelId: member.voice.channelId } });
		if (customChannel) {
			if (customChannel.userId != member.user.id) {
				message.reply('Not your Channel!');
				return;
			}
			const channel = message.guild.channels.cache.get(customChannel.channelId);
			channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: false });

			message.reply('Set to private');
		}
	}
};
