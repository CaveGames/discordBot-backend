// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-voiceStateUpdate
const config = require('../../../config.json');

const { Permissions } = require('discord.js');
const { CustomChannels, UserData } = require('../../database').models;

module.exports = {
	name: 'voiceStateUpdate',

	async run(client, oldState, newState) {
		if (oldState.channelId == newState.channelId) return;

		const member = newState.guild.members.cache.get(newState.id);

		const customChannelOld = await CustomChannels.findOne({
			where: { guildId: oldState.guild.id, voiceChannelId: oldState.channelId },
		});
		if (customChannelOld) {
			const voiceChannel = oldState.guild.channels.cache.get(customChannelOld.voiceChannelId);
			const textChannel = oldState.guild.channels.cache.get(customChannelOld.textChannelId);

			if (!voiceChannel) {
				return;
			}

			if (voiceChannel.members.size == 0) {
				voiceChannel.delete();

				if (textChannel) {
					textChannel.delete();
				}

				customChannelOld.destroy();
				return;
			}

			if (textChannel) {
				textChannel.permissionOverwrites.edit(member.user.id, { VIEW_CHANNEL: null });
			}

			if (customChannelOld.logging) {
				if (member.nickname) {
					voiceChannel.send(
						`:call_me: \`${member.nickname} (${member.user.username}#${member.user.discriminator})\` hat den Kanal verlassen.`,
					);
				}
				else {
					voiceChannel.send(
						`:call_me: \`${member.user.username}#${member.user.discriminator}\` hat den Kanal verlassen.`,
					);
				}
			}
		}

		const customChannelNew = await CustomChannels.findOne({
			where: { guildId: newState.guild.id, voiceChannelId: newState.channelId },
		});
		if (customChannelNew) {
			const voiceChannel = oldState.guild.channels.cache.get(customChannelNew.voiceChannelId);
			const textChannel = oldState.guild.channels.cache.get(customChannelNew.textChannelId);

			if (textChannel) {
				textChannel.permissionOverwrites.edit(member.user.id, { VIEW_CHANNEL: true });
			}

			if (customChannelNew.logging) {
				if (member.nickname) {
					voiceChannel.send(
						`:call_me: \`${member.nickname} (${member.user.username}#${member.user.discriminator})\` hat den Kanal betreten.`,
					);
				}
				else {
					voiceChannel.send(
						`:call_me: \`${member.user.username}#${member.user.discriminator}\` hat den Kanal betreten.`,
					);
				}
			}

			return;
		}

		if (newState.channelId == config.customChannels.channelId) {
			const userData = await UserData.findOne({
				where: {
					guildId: newState.guild.id,
					userId: member.user.id,
				},
			});

			const voiceChannel = await newState.guild.channels.create('Talk: ' + member.user.username, {
				type: 'GUILD_VOICE',
				parent: config.customChannels.categoryId,
				permissionOverwrites: [
					{
						id: member.user.id,
						allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT],
					},
					{
						id: config.customChannels.bypassRoleId,
						allow: [Permissions.FLAGS.MANAGE_CHANNELS, Permissions.FLAGS.VIEW_CHANNEL, Permissions.FLAGS.CONNECT],
					},
				],
			});

			CustomChannels.create({
				guildId: newState.guild.id,
				voiceChannelId: voiceChannel.id,
				ownerId: userData.id,
			});

			member.voice.setChannel(voiceChannel);
		}
	},
};
