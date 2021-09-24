const { sequelize, Sequelize } = require('../sequelize');

const CustomChannels = sequelize.define(
	'customChannels',
	{
		id: {
			type: Sequelize.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		guildId: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		channelId: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		userId: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		isPrivateChannel: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
		isHidden: {
			type: Sequelize.BOOLEAN,
			defaultValue: false,
			allowNull: false,
		},
	},
	{
		freezeTableName: true,
		timestamps: false,
	},
);

module.exports = CustomChannels;
