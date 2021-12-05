const { UserData } = require('../../database').models;
const config = require('../../../config.json');

module.exports = {
	name: 'guildMemberUpdate',

	async run(client, oldMember, newMember) {
		if (!oldMember.pending || newMember.pending) return;
		if (!config.rules.usingRulesSplash) return;

		config.rules.unverifiedRoleIds.forEach(role => {
			newMember.roles.remove(newMember.guild.roles.cache.get(role));
		});

		config.rules.verifiedRoleIds.forEach(role => {
			newMember.roles.add(newMember.guild.roles.cache.get(role));
		});

		UserData.update(
			{
				isVerified: true,
			},
			{
				where: {
					userId: newMember.user.id,
					guildId: newMember.guild.id,
				},
			},
		);
	},
};
