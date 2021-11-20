const DataTypes = require('sequelize');

module.exports = {
	name: 'GuildData',
	table: {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		firstJoinDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
		},
		ownerId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	associations: [
		{
			type: 'hasMany',
			table: 'CustomChannels',
			options: {
				foreignKey: 'guildId',
			},
		},
	],
};
