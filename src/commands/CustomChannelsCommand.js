const { CustomChannels, CustomChannelBans, UserData } = require('../database').models;

const config = require('../../config.json');

module.exports = {
	command: 'cc',

	async run(client, message, args) {
		const member = message.guild.members.cache.get(message.author.id);
		const customChannel = await CustomChannels.findOne({
			where: {
				guildId: message.guild.id,
				channelId: member.voice.channelId,
			},
			include: 'owner',
		});

		if (!customChannel) {
			message.reply({ content: ':x: Du befindest dich in keinem CustomChannel!' });
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
								value: '<@' + customChannel.owner.userId + '>',
							},
							{
								name: 'Status',
								value: customChannel.isPrivate ? 'Privat' : 'Öffentlich',
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

		if (customChannel.userId != member.user.id && !member.roles.cache.get(config.customChannels.bypassRoleId)) {
			message.reply({ content: ':x: Das ist nicht dein Kanal!' });
			return;
		}

		if (args[0] == 'private' || args[0] == 'public') {
			if (customChannel.isPrivate) {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: null, VIEW_CHANNEL: null });
				customChannel.update({
					isPrivate: false,
					isHidden: false,
				});
				message.reply({ content: ':white_check_mark: Der Kanal wurde auf öffentlich gestellt.' });
			}
			else {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { CONNECT: false });
				customChannel.update({
					isPrivate: true,
				});
				message.reply({ content: ':white_check_mark: Der Kanal wurde auf privat gestellt.' });
			}
		}
		else if (args[0] == 'hide' || args[0] == 'show') {
			if (customChannel.isHidden) {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { VIEW_CHANNEL: null });
				customChannel.update({
					isHidden: false,
				});
				message.reply({ content: ':white_check_mark: Der Kanal wurde für alle Nutzer sichtbar gemacht.' });
			}
			else {
				channel.permissionOverwrites.edit(message.guild.roles.everyone.id, { VIEW_CHANNEL: false });
				customChannel.update({
					isHidden: true,
				});
				message.reply({ content: ':white_check_mark: Der Kanal wurde vor anderen Nutzern verborgen.' });
			}
		}
		else if (args[0] == 'kick') {
			const kickUser = message.mentions.users.first();

			if (!kickUser) {
				message.reply({ content: `:x: Bitte verwende **${config.prefix}${this.command} kick [Benutzername]**` });
				return;
			}

			const kickMember = message.guild.members.cache.get(kickUser.id);
			if (!kickMember.voice.channelId || kickMember.voice.channelId != customChannel.channelId) {
				message.reply({ content: ':x: Dieser Nutzer ist aktuell nicht in deinem Kanal!' });
				return;
			}
			if (kickMember.user.id == member.user.id) {
				message.reply({ content: ':x: Du kannst dich nicht selbst kicken!' });
				return;
			}
			if (kickMember.roles.cache.get(config.customChannels.bypassRoleId)) {
				message.reply({ content: ':x: Du darfst diesen Nutzer nicht kicken!' });
				return;
			}

			kickMember.voice.disconnect();
			message.reply('Kicked user');
		}
		else if (args[0] == 'ban' || args[0] == 'unban') {
			const banUser = message.mentions.users.first();

			if (!banUser) {
				message.reply({ content: `:x: Bitte verwende **${config.prefix}${this.command} ban [Benutzername]**` });
				return;
			}

			const banMember = message.guild.members.cache.get(banUser.id);
			if (banMember.user.id == member.user.id) {
				message.reply({ content: ':x: Du kannst dich nicht selbst bannen!' });
				return;
			}
			if (banMember.roles.cache.get(config.customChannels.bypassRoleId)) {
				message.reply({ content: ':x: Du darfst diesen Nutzer nicht bannen!' });
				return;
			}

			const banMemberData = await UserData.findOne({
				where: {
					guildId: message.guild.id,
					userId: banMember.user.id,
				},
				include: 'customChannelBans',
			});

			const ban = banMemberData.customChannelBans.find(x => x.customChannelId == customChannel.id);

			if (ban) {
				ban.destroy();

				channel.permissionOverwrites.edit(banMember.user.id, { CONNECT: null });
				message.reply({ content: ':white_check_mark: Der Nutzer wurde entbannt.' });
			}
			else {
				CustomChannelBans.create({
					customChannelId: customChannel.id,
					userId: banMemberData.id,
				});

				channel.permissionOverwrites.edit(banMember.user.id, { CONNECT: false });

				if (banMember.voice.channelId && banMember.voice.channelId == customChannel.channelId) {
					banMember.voice.disconnect();
				}

				message.reply({ content: ':white_check_mark: Der Nutzer wurde gebannt.' });
			}
		}
		else {
			message.reply({ content: ':x: Dieser Unterbefehl existiert nicht!' });
		}
	},
};
