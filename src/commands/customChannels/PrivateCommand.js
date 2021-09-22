const fs = require('fs');

module.exports = {
	command: 'ccprivate',

	async run(client, message, args) {
		var data = JSON.parse(fs.readFileSync(__dirname + '/../../../data/customChannels.json'));

		const member = message.guild.members.cache.get(message.author.id);
		const customChannel = data.find((x) => (x.channel = member.voice.channelId));
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
