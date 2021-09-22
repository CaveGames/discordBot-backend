// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const config = require('../../slappey.json');

const { Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'voiceStateUpdate',

	async run(client, oldState, newState) {
		if (oldState.channelId == newState.channelId) return;

		var data = JSON.parse(fs.readFileSync(__dirname + '/../../data/customChannels.json'));

		const customChannel = data.find((x) => (x.channel = oldState.channelId));
		if (customChannel) {
			const channel = oldState.guild.channels.cache.get(customChannel.channelId);

			if (channel.members.size == 0) {
				channel.delete();

				data.splice(data.indexOf(customChannel), 1);
				fs.writeFile(
					__dirname + '/../../data/customChannels.json',
					JSON.stringify(data),
					'utf8',
					function() {}
				);
			}
		}

		if (newState.channelId == config.customChannels.channelId) {
			const member = newState.guild.members.cache.get(newState.id);

			const channel = await newState.guild.channels.create('Talk: ' + member.user.username, {
				type: 'GUILD_VOICE',
				parent: config.customChannels.categoryId,
				permissionOverwrites: [
					{
						id: member.user.id,
						allow: [
							Permissions.FLAGS.MANAGE_CHANNELS,
							Permissions.FLAGS.CONNECT,
							Permissions.FLAGS.MUTE_MEMBERS,
							Permissions.FLAGS.DEAFEN_MEMBERS
						]
					}
				]
			});

			data.push({ userId: member.user.id, channelId: channel.id });
			fs.writeFile(__dirname + '/../../data/customChannels.json', JSON.stringify(data), 'utf8', function() {});

			member.voice.setChannel(channel);
		}
	}
};
