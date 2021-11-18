const path = require('path');
const fs = require('fs').promises;
const config = require('../../config.json');

async function registerCommands(client, dir = '') {
	const filePath = path.join(__dirname, dir);
	const files = await fs.readdir(filePath);
	for (const file of files) {
		const stat = await fs.lstat(path.join(filePath, file));
		if (stat.isDirectory()) registerCommands(client, path.join(dir, file));
		if (file.endsWith('.js')) {
			const cmd = require(path.join(filePath, file));
			client.commands.set(cmd.command, function(cmdClient, cmdMessage, cmdArgs) {
				runCmd(cmd, cmdClient, cmdMessage, cmdArgs);
			});

			if (cmd.aliases) {
				cmd.aliases.forEach(alias => {
					client.commands.set(alias, function(cmdClient, cmdMessage, cmdArgs) {
						runCmd(cmd, cmdClient, cmdMessage, cmdArgs);
					});
				});
			}
		}
	}
}

function runCmd(cmd, cmdClient, cmdMessage, cmdArgs) {
	if (cmd.onlyAdmin) {
		if (cmdMessage.member.roles.cache.get(config.adminRoleId) == null) return;
	}
	else if (config.botChannelId != '') {
		if (cmdMessage.channelId != config.botChannelId) return;
	}

	cmd.run(cmdClient, cmdMessage, cmdArgs);
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
