const { UserData, Tickets } = require('../../database').models;
const { Permissions } = require('discord.js');
const emoji = require('emoji-dictionary');
const config = require('../../../config.json');

module.exports = {
	name: 'interactionCreate',

	async run(client, interaction) {
		const member = interaction.guild.members.cache.get(interaction.user.id);

		if (interaction.componentType == 'SELECT_MENU' && interaction.customId == 'ticket_select') {
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
				ownerId: userData.id,
				category: interaction.values[0],
			});

			const id = String(ticket.id).padStart(4, '0');

			const channel = await interaction.guild.channels.create(id + '-' + member.user.username, {
				topic:
					':' +
					config.tickets.categories[interaction.values[0]].emoji +
					': ' +
					config.tickets.categories[interaction.values[0]].name,
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
