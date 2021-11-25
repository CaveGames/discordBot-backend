const emoji = require('emoji-dictionary');

const config = require('../../config.json');

module.exports = {
	command: 'ticket',
	onlyAdmin: true,

	async run(client, message) {
		const channel = message.guild.channels.cache.get(config.tickets.channelId);
		const messages = await channel.messages.fetch();
		messages.forEach(msg => msg.delete());

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
	},
};
