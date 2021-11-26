const DataTypes = require('sequelize');

module.exports = {
	name: 'Tickets',
	table: {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		ownerId: {
			type: DataTypes.STRING,
			allowNull: false,
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
			type: DataTypes.STRING,
		},
	},
	associations: [
		{
			type: 'belongsTo',
			table: 'GuildData',
			options: {
				foreignKey: {
					name: 'guildId',
				},
				onDelete: 'CASCADE',
			},
		},
		{
			type: 'belongsTo',
			table: 'UserData',
			options: {
				as: 'tickets',
				foreignKey: {
					name: 'ownerId',
				},
			},
		},
		{
			type: 'belongsTo',
			table: 'UserData',
			options: {
				as: 'closedTickets',
				foreignKey: {
					name: 'closedUserId',
				},
			},
		},
	],
};
