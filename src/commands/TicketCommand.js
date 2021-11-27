const emoji = require('emoji-dictionary');

const config = require('../../config.json');

module.exports = {
	command: 'ticket',
	onlyAdmin: true,

	async run(client, message) {
		const channel = message.guild.channels.cache.get(config.tickets.channelId);
		const messages = await channel.messages.fetch();
		messages.forEach(msg => msg.delete());

		if (config.tickets.categories.length > 1) {
			const options = [];
			config.tickets.categories.forEach((category, i) => {
				options.push({
					label: category.name,
					value: i.toString(),
					description: category.description,
					emoji: category.emoji != null ? emoji.getUnicode(category.emoji) : null,
				});
			});

			channel.send({
				embeds: [
					{
						title: 'Ticket System',
						description: 'Wähle hier das Ticket aus, welches du erstellen möchtest',
						color: config.accentColor,
					},
				],
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								placeholder: 'Wähle eine Kategorie',
								custom_id: 'ticket_select',
								options: options,
							},
						],
					},
				],
			});
		}
		else if (config.tickets.categories.length == 1) {
			channel.send({
				embeds: [
					{
						title: 'Ticket System',
						description: 'Klicke auf den Knopf um ein Ticket zu öffnen',
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
								label: config.tickets.categories[0].name,
								emoji:
									config.tickets.categories[0].emoji != null
										? emoji.getUnicode(config.tickets.categories[0].emoji)
										: null,
								custom_id: 'ticket_select',
							},
						],
					},
				],
			});
		}
	},
};
