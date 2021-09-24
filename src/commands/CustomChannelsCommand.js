const { Permissions } = require('discord.js');
const { CustomChannels } = require('../database').models;

const config = require('../../slappey.json');

module.exports = {
	command: 'cc',

	async run(client, message, args) {
		const member = message.guild.members.cache.get(message.author.id);
		const customChannel = await CustomChannels.findOne({
			where: { guildId: message.guild.id, channelId: member.voice.channelId },
		});

		if (!customChannel) {
			message.reply('Connect to a custom Channel first');
			return;
		}

		const channel = message.guild.channels.cache.get(customChannel.channelId);

		if (args.length == 0) {
			message.reply({
				embeds: [
					{
						title: channel.name,
						fields: [
							{
								name: 'Eigentümer',
								value: '<@' + customChannel.userId + '>',
							},
							{
								name: 'Status',
								value: customChannel.isPrivateChannel ? 'Privat' : 'Öffentlich',
								inline: true,
							},
							{
								name: 'Sichtbarkeit',
								value: customChannel.isHidden ? 'Versteckt' : 'Sichtbar',
								inline: true,
							},
						],
					},
				],
			});
			return;
		}

		if (customChannel.userId != member.user.id) {
			message.reply('Not your Channel!');
			return;
		}

		if (args[0] == 'private' || args[0] == 'public') {
			if (customChannel.isPrivateChannel) {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: null });
				CustomChannels.update({ isPrivateChannel: false, isHidden: false }, { where: { id: customChannel.id } });
				message.reply('Set to public');
			} else {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: false });
				CustomChannels.update({ isPrivateChannel: true }, { where: { id: customChannel.id } });
				message.reply('Set to private');
			}
		} else if (args[0] == 'hide' || args[0] == 'show') {
			if (customChannel.isHidden) {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { VIEW_CHANNEL: null });
				CustomChannels.update({ isHidden: false }, { where: { id: customChannel.id } });
				message.reply('Set to shown');
			} else {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { VIEW_CHANNEL: false });
				CustomChannels.update({ isHidden: true }, { where: { id: customChannel.id } });
				message.reply('Set to hidden');
			}
		} else if (args[0] == 'kick') {
			let kickUser = message.mentions.users.first();

			if (!kickUser) {
				message.reply('Please select a user');
				return;
			}

			kickMember = message.guild.members.cache.get(kickUser.id);
			if (!kickMember.voice.channelId || kickMember.voice.channelId != customChannel.channelId) {
				message.reply("User isn't in your Channel");
				return;
			}
			if (kickMember.user.id == member.user.id) {
				message.reply("You can't kick yourself out!");
				return;
			}
			if(kickMember.roles.cache.get(config.customChannels.bypassRoleId)) {
				message.reply("You can't kick this user!");
				return;
			}

			kickMember.voice.disconnect();
			message.reply('Kicked user');
		} else {
			message.reply('Invalid Argument');
		}
	},
};
