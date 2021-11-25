const { UserData } = require('../database').models;
const config = require('../../config.json');

module.exports = {
	name: 'guildMemberAdd',

	async run(client, member) {
		if (member.user.bot) return;

		const userData = await UserData.findOne({
			where: {
				guildId: member.guild.id,
				userId: member.user.id,
			},
		});

		if (userData) {
			if (userData.isVerified) {
				config.rules.verifiedRoleIds.forEach(role => {
					member.roles.add(member.guild.roles.cache.get(role));
				});
			}
		}
		else {
			UserData.create({
				guildId: member.guild.id,
				userId: member.user.id,
			});

			config.rules.unverifiedRoleIds.forEach(role => {
				member.roles.add(member.guild.roles.cache.get(role));
			});
		}
	},
};
