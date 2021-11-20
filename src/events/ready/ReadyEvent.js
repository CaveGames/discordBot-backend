const { connection } = require('../../database');

module.exports = {
	name: 'ready',

	async run(client) {
		connection.sync();

		console.log(client.user.tag + ' has logged in.');
	},
};
