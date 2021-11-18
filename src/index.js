const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');

const config = require('../slappey.json');

const client = new Client({
	intents: 32767,
});

(async () => {
	client.commands = new Map();
	client.events = new Map();
	client.prefix = config.prefix;
	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(config.token);

	client.user.setActivity('SAO');
})();

const httpServer = require('http').createServer();
require('socket.io')(httpServer, {
	cors: {
		origin: 'http://localhost:8080',
	},
});
httpServer.listen(3000);
