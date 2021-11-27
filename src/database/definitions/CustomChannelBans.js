const DataTypes = require('sequelize');

module.exports = {
	name: 'CustomChannelBans',
	table: {
		customChannelId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	associations: [
		{
			type: 'belongsTo',
			table: 'CustomChannels',
			options: {
				as: 'channel',
				foreignKey: 'customChannelId',
				onDelete: 'CASCADE',
			},
		},
		{
			type: 'belongsTo',
			table: 'UserData',
			options: {
				as: 'user',
				foreignKey: 'userId',
				onDelete: 'CASCADE',
			},
		},
	],
};
