const { Util } = require('discord.js');
const emoji = require('emoji-dictionary');

const config = require('../../slappey.json');

module.exports = {
	command: 'rules',
	onlyAdmin: true,

	async run(client, message) {
		const channel = message.guild.channels.cache.get(config.rules.channelId);
		const test = await channel.messages.fetch();
		test.forEach(msg => msg.delete());

		// let rules = config.rules.text;

		// config.rules.text.match(/@\w+/g).forEach(match => {
		// 	const role = message.guild.roles.cache.find(x => x.name === match.substring(1));
		// 	if (role) {
		// 		rules = rules.replace(match, '<@&' + role.id + '>');
		// 		return;
		// 	}
		// 	const user = message.guild.members.cache.find(x => x.username === match.substring(1));
		// 	if (user) {
		// 		rules = rules.replace(match, '<@' + role.id + '>');
		// 		return;
		// 	}
		// });

		// config.rules.text.match(/#\w+/g).forEach(match => {
		// 	console.log(match);
		// 	const mentionedChannel = message.guild.channels.cache.find(x => x.name === match.substring(1));
		// 	if (mentionedChannel) {
		// 		rules = rules.replace(match, '<@#' + mentionedChannel.id + '>');
		// 		return;
		// 	}
		// });

		const chunks = Util.splitMessage(config.rules.text, { char: config.rules.paragraphSplitter });

		const embeds = [];
		chunks.forEach((chunk, i) =>
			embeds.push({
				title: 'Regelwerk im Discord | ' + (i + 1) + ' von ' + chunks.length,
				description: chunk,
				color: config.accentColor,
			}),
		);

		channel.send({
			embeds: embeds,
			components: [
				{
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
				},
			],
		});
	},
};
