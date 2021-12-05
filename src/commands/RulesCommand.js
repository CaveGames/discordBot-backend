const { Util } = require('discord.js');
const emoji = require('emoji-dictionary');

const config = require('../../config.json');

module.exports = {
	command: 'rules',
	onlyAdmin: true,

	async run(client, message) {
		const channel = message.guild.channels.cache.get(config.rules.channelId);
		const messages = await channel.messages.fetch();
		messages.forEach(msg => msg.delete());

		const chunks = Util.splitMessage(config.rules.text, { char: config.rules.paragraphSplitter });

		const embeds = [];
		chunks.forEach((chunk, i) =>
			embeds.push({
				title: 'Regelwerk im Discord | ' + (i + 1) + ' von ' + chunks.length,
				description: chunk,
				color: config.accentColor,
			}),
		);

		const acceptButton = {
			type: 1,
			components: [
				{
					type: 2,
					style: 3,
					label: 'Regeln akzeptieren',
					emoji: emoji.getUnicode('heavy_check_mark'),
					custom_id: 'accept_rules',
				},
			],
		};

		channel.send({
			embeds: embeds,
			components: config.rules.usingRulesSplash ? [] : [acceptButton],
		});
	},
};
