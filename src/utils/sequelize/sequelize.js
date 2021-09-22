const Sequelize = require('sequelize');

const sequelize = new Sequelize('', '', '', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'data.sqlite'
});

module.exports = {
	sequelize,
	Sequelize
};
