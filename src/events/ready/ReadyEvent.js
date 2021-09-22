module.exports = {
	name: 'ready',

	async run(client) {
		console.log(client.user.tag + ' has logged in.');
	}
};
