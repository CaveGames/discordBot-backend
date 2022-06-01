const { Client } = require('discord.js');
const { registerCommands, registerEvents } = require('./utils/registry');

const config = require('../config.json');

const client = new Client({
	intents: 32767,
});

global.client = client;

(async () => {
	client.commands = new Map();
	client.events = new Map();
	client.prefix = config.prefix;
	await registerCommands(client, '../commands');
	await registerEvents(client, '../events');
	await client.login(config.token);

	// client.user.setActivity('SAO');
})();

if (config.enableApi) {
	require('./api');
}

global.cron = require('./cron');
global.cron.register();
