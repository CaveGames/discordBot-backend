const DataTypes = require('sequelize');

module.exports = {
	name: 'CustomChannels',
	table: {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		channelId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		isPrivateChannel: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		isHidden: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	associations: [
		{
			type: 'hasMany',
			table: 'CustomChannelBans',
			options: {
				as: 'bans',
			},
		},
	],
};
