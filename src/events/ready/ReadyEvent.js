const CustomChannels = require('../../utils/sequelize/models/CustomChannels');

module.exports = {
	name: 'ready',

	async run(client) {
		CustomChannels.sync();

		console.log(client.user.tag + ' has logged in.');
	}
};
