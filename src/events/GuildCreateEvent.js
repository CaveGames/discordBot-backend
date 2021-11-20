const { GuildData } = require('../database').models;
const config = require('../../config.json');

module.exports = {
	name: 'guildCreate',

	async run(client, guild) {
		const logs = await guild.fetchAuditLogs({ type: 'BOT_ADD', limit: 1 });
		const owner = logs.entries.first().executor;

		GuildData.create({
			guildId: guild.id,
			ownerId: owner.id,
		});
	},
};
