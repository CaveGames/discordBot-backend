const DataTypes = require('sequelize');

module.exports = {
	name: 'CustomChannelBans',
	table: {
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	associations: [
		{
			type: 'belongsTo',
			table: 'CustomChannels',
			options: {
				onDelete: 'CASCADE',
			},
		},
	],
};
