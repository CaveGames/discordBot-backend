const path = require('path');
const fs = require('fs').promises;

async function registerCommands(client, dir = '') {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
		if (file.endsWith('.js')) {
			const cmd = require(path.join(filePath, file));
			client.commands.set(cmd.command, cmd);

			if (cmd.aliases) {
				cmd.aliases.forEach(alias => {
					client.commands.set(alias, cmd);
				});
			}
		}
	}
}

async function registerEvents(client, dir = '') {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerEvents(client, path.join(dir, file));
		if (file.endsWith('.js')) {
			const event = require(path.join(filePath, file));
			client.events.set(event.name, event);
			client.on(event.name, event.run.bind(event, client));
		}
	}
}

module.exports = {
	registerCommands,
	registerEvents,
};
