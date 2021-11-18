const { UserData } = require('../../database').models;
const config = require('../../../config.json');

module.exports = {
	name: 'interactionCreate',

	async run(client, interaction) {
		if (interaction.componentType != 'BUTTON') return;

		if (interaction.customId == 'accept_rules') {
			const member = interaction.guild.members.cache.get(interaction.user.id);

			const userData = await UserData.findOne({
				where: {
					guildId: interaction.guild.id,
					userId: interaction.user.id,
				},
			});

			if (userData.isVerified) {
				interaction.reply({ content: ':x: Du hast die Regeln bereits akzeptiert.', ephemeral: true });
				return;
			}

			config.rules.unverifiedRoleIds.forEach(role => {
				member.roles.remove(interaction.guild.roles.cache.get(role));
			});

			config.rules.verifiedRoleIds.forEach(role => {
				member.roles.add(interaction.guild.roles.cache.get(role));
			});

			UserData.update(
				{
					isVerified: true,
				},
				{
					where: {
						id: userData.id,
					},
				},
			);

			interaction.reply({
				embeds: [
					{
						title: 'Regelwerk im Discord',
						description: 'Du hast die Regeln akzeptiert.\n**Viel Spaß auf dem ' + config.serverName + ' Discord**',
						color: config.accentColor,
					},
				],
				ephemeral: true,
			});
		}
	},
};
