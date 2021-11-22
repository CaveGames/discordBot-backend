const { GuildData, UserData } = require('../database').models;
const config = require('../../config.json');

module.exports = {
	name: 'guildCreate',

	async run(client, guild) {
		const logs = await guild.fetchAuditLogs({ type: 'BOT_ADD', limit: 1 });
		const owner = logs.entries.first().executor;

		await GuildData.create({
			guildId: guild.id,
			ownerId: owner.id,
		});

		const members = guild.members.cache;
		members.forEach(member => {
			if (member.user.bot) return;

			UserData.create({
				userId: member.user.id,
				guildId: guild.id,
				firstJoinDate: new Date(member.joinedTimestamp),
				isVerified: false,
			});
		});
	},
};
