const DataTypes = require('sequelize');

module.exports = {
	name: 'GuildData',
	table: {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
		},
		joinDate: {
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
			table: 'UserData',
			options: {
				as: 'users',
				foreignKey: 'guildId',
			},
		},
		{
			type: 'hasMany',
			table: 'CustomChannels',
			options: {
				as: 'customChannels',
				foreignKey: 'guildId',
			},
		},
		{
			type: 'hasMany',
			table: 'Tickets',
			options: {
				as: 'tickets',
				foreignKey: 'guildId',
			},
		},
	],
};
