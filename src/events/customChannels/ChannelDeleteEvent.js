// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
const CustomChannels = require('../../utils/sequelize/models/CustomChannels');

module.exports = {
	name: 'channelDelete',

	async run(client, channel) {
		var customChannel = await CustomChannels.findOne({
			where: { guildId: channel.guild.id, channelId: channel.id }
		});

		if (customChannel) {
			CustomChannels.destroy({ where: { id: customChannel.id } });
		}
	}
};
