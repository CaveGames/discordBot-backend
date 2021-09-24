const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const connection = new Sequelize('', '', '', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'data.sqlite',
});

const models = {};

fs.readdirSync(path.join(__dirname, 'definitions'))
	.filter(function(file) {
		return file.endsWith('.js') !== 0 && file !== 'index.js';
	})
	.forEach(function(file) {
		const name = file.replace('.js', '');
		const model = require(path.join(__dirname, 'definitions', file));

		models[name] = connection.define(name, model, {
			freezeTableName: true,
			timestamps: false,
		});
	});

module.exports = {
	connection,
	models,
};
