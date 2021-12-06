const config = require('../../../config.json');

module.exports = async (req, res, next) => {
	if (!req.params.guildId) {
		res.status(404).json({});
		return;
	}

	const guild = global.client.guilds.cache.get(req.params.guildId);
	const member = guild.members.cache.get(req.user.id);

	if (!member.roles.cache.get(config.adminRoleId)) {
		res.status(404).json({});
		return;
	}
	next();
};
