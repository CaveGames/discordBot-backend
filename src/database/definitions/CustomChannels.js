const DataTypes = require('sequelize');

module.exports = {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	guildId: {
		type: DataTypes.STRING,
		allowNull: false,
	},
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
}
