const DataTypes = require('sequelize');

module.exports = {
	name: 'CustomChannels',
	table: {
		guildId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		voiceChannelId: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		textChannelId: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		ownerId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		isPrivate: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		isHidden: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		logging: {
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
			type: 'belongsTo',
			table: 'UserData',
			options: {
				as: 'owner',
				foreignKey: 'ownerId',
			},
		},
		{
			type: 'hasMany',
			table: 'CustomChannelBans',
			options: {
				as: 'bans',
				foreignKey: 'customChannelId',
			},
		},
	],
};
