const DataTypes = require('sequelize');

module.exports = {
	name: 'UserData',
	table: {
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstJoinDate: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			allowNull: false,
		},
		isVerified: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	associations: [
		{
			type: 'belongsTo',
			table: 'GuildData',
			options: {
				as: 'guild',
				foreignKey: 'guildId',
				onDelete: 'CASCADE',
			},
		},
		{
			type: 'hasOne',
			table: 'CustomChannels',
			options: {
				as: 'customChannel',
				foreignKey: 'ownerId',
			},
		},
		{
			type: 'hasMany',
			table: 'CustomChannelBans',
			options: {
				as: 'customChannelBans',
				foreignKey: 'userId',
			},
		},
		{
			type: 'hasMany',
			table: 'Tickets',
			options: {
				as: 'tickets',
				foreignKey: 'ownerId',
			},
		},
		{
			type: 'hasMany',
			table: 'Tickets',
			options: {
				as: 'closedTickets',
				foreignKey: 'closedUserId',
			},
		},
	],
};
