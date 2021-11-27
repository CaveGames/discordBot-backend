const { UserData, Tickets } = require('../../database').models;
const { Permissions } = require('discord.js');
const emoji = require('emoji-dictionary');
const config = require('../../../config.json');

module.exports = {
	name: 'interactionCreate',

	async run(client, interaction) {
		const member = interaction.guild.members.cache.get(interaction.user.id);

		if (interaction.customId == 'ticket_select') {
			let categoryId;
			if (interaction.componentType == 'SELECT_MENU') {
				categoryId = interaction.values[0];
			}
			else if (interaction.componentType == 'BUTTON') {
				categoryId = 0;
			}

			const userData = await UserData.findOne({
				where: {
					guildId: interaction.guild.id,
					userId: interaction.user.id,
				},
				include: 'tickets',
			});

			if (userData.tickets.length > 0) {
				const foundTicket = userData.tickets.find(x => x.category == categoryId && x.isOpen);

				if (foundTicket) {
					if (interaction.componentType == 'SELECT_MENU') {
						interaction.reply({ content: ':x: Du hast bereits ein Ticket dieser Kategorie offen.', ephemeral: true });
					}
					else {
						interaction.reply({ content: ':x: Du hast bereits ein Ticket offen.', ephemeral: true });
					}
					return;
				}
			}

			const ticket = await Tickets.create({
				guildId: interaction.guild.id,
				ownerId: userData.id,
				category: categoryId,
			});

			const id = String(ticket.id).padStart(4, '0');

			const channel = await interaction.guild.channels.create(id + '-' + member.user.username, {
				topic: ':' + config.tickets.categories[categoryId].emoji + ': ' + config.tickets.categories[categoryId].name,
				type: 'GUILD_TEXT',
				parent: config.tickets.categories[categoryId].categoryId,
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

			ticket.update({
				channelId: channel.id,
			});

			channel.send({
				embeds: [
					{
						title: 'Ticket System',
						description:
							'Willkommen <@' +
							member.user.id +
							'> zu deinem Ticket!\n**Ein Teammitglied wird in kürze für dich da sein!**\nBitte erläutere schonmal dein Anliegen.',
						color: config.accentColor,
					},
				],
				components: [
					{
						type: 1,
						components: [
							{
								type: 2,
								style: 2,
								label: 'Ticket schließen',
								emoji: emoji.getUnicode('lock'),
								custom_id: 'ticket_close',
							},
						],
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
		else if (interaction.componentType == 'BUTTON' && interaction.customId == 'ticket_close') {
			const ticket = await Tickets.findOne({
				where: {
					guildId: interaction.guild.id,
					channelId: interaction.channelId,
				},
			});

			if (!ticket) return;

			const userData = await UserData.findOne({
				where: {
					guildId: interaction.guild.id,
					userId: interaction.user.id,
				},
			});

			const channel = interaction.guild.channels.cache.get(interaction.channelId);
			channel.delete();

			ticket.update({
				channelId: null,
				isOpen: false,
				closedDate: Date.now(),
				closedUserId: userData.id,
			});
		}
	},
};
