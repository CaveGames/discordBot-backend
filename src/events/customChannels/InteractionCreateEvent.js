const { CustomChannels } = require('../../database').models;
const config = require('../../../config.json');

module.exports = {
	name: 'interactionCreate',

	async run(client, interaction) {
		if (interaction.componentType != 'BUTTON') return;
		if (!interaction.customId.startsWith('cc')) return;

		const member = interaction.guild.members.cache.get(interaction.user.id);
		const customChannel = await CustomChannels.findOne({
			where: {
				guildId: interaction.guild.id,
				channelId: member.voice.channelId,
			},
			include: 'owner',
		});

		if (!customChannel) {
			interaction.reply({ content: ':x: Du befindest dich in keinem CustomChannel!', ephemeral: true });
			return;
		}

		const channel = interaction.guild.channels.cache.get(customChannel.channelId);

		if (interaction.customId == 'cc_info') {
			interaction.reply({
				embeds: [
					{
						title: channel.name,
						color: config.accentColor,
						fields: [
							{
								name: 'Eigentümer',
								value: '<@' + customChannel.owner.userId + '>',
							},
							{
								name: 'Status',
								value: customChannel.isPrivate ? 'Privat' : 'Öffentlich',
								inline: true,
							},
							{
								name: 'Sichtbarkeit',
								value: customChannel.isHidden ? 'Versteckt' : 'Sichtbar',
								inline: true,
							},
						],
					},
				],
				ephemeral: true,
			});
			return;
		}
	},
};
