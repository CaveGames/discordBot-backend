const { GuildData } = require('../database').models;
const config = require('../../config.json');

module.exports = {
	name: 'guildDelete',

	async run(client, guild) {
		GuildData.destroy({
			where: {
				guildId: guild.id,
			},
		});
	},
};
