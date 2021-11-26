const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const connection = new Sequelize('discordBot', 'bot', 'password', {
	host: 'sql',
	dialect: 'mysql',
	logging: false,
});

const models = {};
const definitions = {};

fs.readdirSync(path.join(__dirname, 'definitions'))
	.filter(function(file) {
		return file.endsWith('.js') !== 0 && file !== 'index.js';
	})
	.forEach(function(file) {
		const model = require(path.join(__dirname, 'definitions', file));

		definitions[model.name] = model;
		models[model.name] = connection.define(model.name, model.table, {
			freezeTableName: true,
			timestamps: false,
		});
	});

Object.keys(models).forEach(key => {
	const definition = definitions[key];

	if (definition.associations) {
		Object.values(definition.associations).forEach(association => {
			switch (association.type) {
			case 'belongsTo':
				models[definition.name].belongsTo(models[association.table], association.options);
				console.log(definition.name + ' belongs to ' + association.table);
				break;
			case 'hasMany':
				models[definition.name].hasMany(models[association.table], association.options);
				console.log(definition.name + ' has many ' + association.table);
				break;
			case 'hasOne':
				models[definition.name].hasOne(models[association.table], association.options);
				console.log(definition.name + ' has one ' + association.table);
				break;
			default:
				console.log('Unknown association ' + association.type + ' from ' + association.table);
				break;
			}
		});
	}
});

module.exports = {
	connection,
	models,
};
