const { UserData } = require('../../database').models;
const config = require('../../../config.json');

module.exports = {
	name: 'interactionCreate',

	async run(client, interaction) {
		if (interaction.componentType != 'SELECT_MENU') return;

		if (interaction.customId == 'ticket_select') {
			const member = interaction.guild.members.cache.get(interaction.user.id);

			const userData = await UserData.findOne({
				where: {
					guildId: interaction.guild.id,
					userId: interaction.user.id,
				},
			});

			interaction.reply({
				embeds: [
					{
						title: 'Ticket System',
						description:
							'Ticket angelegt! Beschreibe dein Anliegen in CHANNEL genauer.\nEin Teammitglied wird sich gleich um dein Problem kümmern.',
						color: config.accentColor,
					},
				],
				ephemeral: true,
			});
		}
	},
};
