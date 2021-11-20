const DataTypes = require('sequelize');

module.exports = {
	name: 'CustomChannels',
	table: {
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
			type: 'belongsTo',
			table: 'GuildData',
			options: {
				foreignKey: {
					name: 'guildId',
					type: DataTypes.STRING,
				},
				onDelete: 'CASCADE',
			},
		},
		{
			type: 'hasMany',
			table: 'CustomChannelBans',
			options: {
				as: 'bans',
			},
		},
	],
};
