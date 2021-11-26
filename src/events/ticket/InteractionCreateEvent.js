const { UserData, Tickets } = require('../../database').models;
const { Permissions } = require('discord.js');
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
				include: 'tickets',
			});

			if (userData.tickets.length > 0) {
				const foundTicket = userData.tickets.find(x => x.category == interaction.values[0] && x.isOpen);

				if (foundTicket) {
					interaction.reply({ content: ':x: Du hast bereits ein Ticket dieser Kategorie offen.', ephemeral: true });
					return;
				}
			}

			const ticket = await Tickets.create({
				guildId: interaction.guild.id,
				ownerId: interaction.user.id,
				category: interaction.values[0],
			});

			const id = String(ticket.id).padStart(4, '0');

			const channel = await interaction.guild.channels.create(id + '-' + member.user.username, {
				type: 'GUILD_TEXT',
				parent: config.tickets.categories[interaction.values[0]].categoryId,
				position: 0,
				permissionOverwrites: [
					{
						id: interaction.guild.roles.everyone,
						deny: [Permissions.FLAGS.VIEW_CHANNEL],
					},
					{
						id: member.user.id,
						allow: [Permissions.FLAGS.VIEW_CHANNEL],
					},
					{
						id: config.tickets.supporterRoleId,
						allow: [Permissions.FLAGS.VIEW_CHANNEL],
					},
				],
			});

			interaction.reply({
				embeds: [
					{
						title: 'Ticket System',
						description:
							'Ticket angelegt! Beschreibe dein Anliegen in <#' +
							channel.id +
							'> genauer.\nEin Teammitglied wird sich gleich um dein Problem kümmern.',
						color: config.accentColor,
					},
				],
				ephemeral: true,
			});
		}
	},
};
