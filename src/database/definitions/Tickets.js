const DataTypes = require('sequelize');

module.exports = {
	name: 'Tickets',
	table: {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ownerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		channelId: {
			type: DataTypes.STRING,
		},
		category: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		isOpen: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		},
		openedDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		closedDate: {
			type: DataTypes.DATE,
		},
		closedUserId: {
			type: DataTypes.INTEGER,
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
			type: 'belongsTo',
			table: 'UserData',
			options: {
				as: 'owner',
				foreignKey: 'ownerId',
			},
		},
		{
			type: 'belongsTo',
			table: 'UserData',
			options: {
				as: 'closedUser',
				foreignKey: 'closedUserId',
			},
		},
	],
};
