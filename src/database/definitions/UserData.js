const DataTypes = require('sequelize');

module.exports = {
	name: 'UserData',
	table: {
		userId: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
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
				foreignKey: {
					name: 'guildId',
				},
				onDelete: 'CASCADE',
			},
		},
	],
};
