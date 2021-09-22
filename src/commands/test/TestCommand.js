module.exports = {
	command: 'test',

	async run(client, message, args) {
		message.channel.send('Test command works');
	}
};
