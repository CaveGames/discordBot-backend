const { UserData, CustomChannels, CustomChannelBans } = require('../../database').models;
const config = require('../../../config.json');

module.exports = {
	name: 'interactionCreate',

	async run(client, interaction) {
		if (interaction.componentType != 'BUTTON') return;
		if (!interaction.customId.startsWith('cc')) return;

		const member = interaction.guild.members.cache.get(interaction.user.id);
		const customChannel = await CustomChannels.findOne({
			where: {
				guildId: interaction.guild.id,
				channelId: member.voice.channelId,
			},
			include: 'owner',
		});

		if (!customChannel) {
			interaction.reply({ content: ':x: Du befindest dich in keinem CustomChannel!', ephemeral: true });
			return;
		}

		const channel = interaction.guild.channels.cache.get(customChannel.channelId);

		if (interaction.customId == 'cc_info') {
			interaction.reply({
				embeds: [
					{
						title: channel.name,
						color: config.accentColor,
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
				ephemeral: true,
			});
			return;
		}

		if (customChannel.owner.userId != member.user.id && !member.roles.cache.get(config.customChannels.bypassRoleId)) {
			interaction.reply({ content: ':x: Das ist nicht dein Kanal!', ephemeral: true });
			return;
		}

		if (interaction.customId == 'cc_private') {
			if (customChannel.isPrivate) {
				channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, { CONNECT: null, VIEW_CHANNEL: null });
				customChannel.update({
					isPrivate: false,
					isHidden: false,
				});
				interaction.reply({ content: ':white_check_mark: Der Kanal wurde auf öffentlich gestellt.', ephemeral: true });
			}
			else {
				channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, { CONNECT: false });
				customChannel.update({
					isPrivate: true,
				});
				interaction.reply({ content: ':white_check_mark: Der Kanal wurde auf privat gestellt.', ephemeral: true });
			}
		}
		else if (interaction.customId == 'cc_hide') {
			if (customChannel.isHidden) {
				channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, { VIEW_CHANNEL: null });
				customChannel.update({
					isHidden: false,
				});
				interaction.reply({
					content: ':white_check_mark: Der Kanal wurde für alle Nutzer sichtbar gemacht.',
					ephemeral: true,
				});
			}
			else {
				channel.permissionOverwrites.edit(interaction.guild.roles.everyone.id, { VIEW_CHANNEL: false });
				customChannel.update({
					isHidden: true,
				});
				interaction.reply({
					content: ':white_check_mark: Der Kanal wurde vor anderen Nutzern verborgen.',
					ephemeral: true,
				});
			}
		}
		else if (interaction.customId == 'cc_kick') {
			const options = [];

			channel.members.forEach(currentMember => {
				if (currentMember.user.id == member.user.id) return;
				if (currentMember.roles.cache.get(config.customChannels.bypassRoleId)) return;

				options.push({
					label: currentMember.nickname ? currentMember.nickname : currentMember.user.username,
					value: currentMember.user.id,
				});
			});

			if (options.length == 0) {
				interaction.reply({ content: ':x: Du darfst keinen der anwesenden Nutzer im Kanal kicken!', ephemeral: true });
				return;
			}

			const responseMessage = await interaction.reply({
				content: 'Wähle hier den Nutzer aus, welchen du kicken möchtest.',
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								custom_id: 'cc_kick_select',
								options: options,
							},
						],
					},
				],
				ephemeral: true,
				fetchReply: true,
			});

			responseMessage
				.awaitMessageComponent({ componentType: 'SELECT_MENU', time: 30000 })
				.then(collectInteraction => {
					const kickMember = collectInteraction.guild.members.cache.get(collectInteraction.values[0]);

					if (!kickMember.voice.channelId || kickMember.voice.channelId != customChannel.channelId) {
						interaction.editReply({
							content: ':x: Dieser Nutzer ist nicht mehr in deinem Kanal!',
							components: [],
						});
						return;
					}

					kickMember.voice.disconnect();
					interaction.editReply({
						content: ':white_check_mark: <@' + kickMember.id + '> wurde gekickt.',
						components: [],
					});
				})
				.catch(error => {
					interaction.editReply({
						content: ':x: Die Zeit zum auswählen ist abgelaufen!',
						components: [],
					});
				});
		}
		else if (interaction.customId == 'cc_ban') {
			const options = [];

			channel.guild.members.cache.forEach(currentMember => {
				if (currentMember.user.bot) return;
				if (currentMember.id == member.user.id) return;
				if (currentMember.roles.cache.get(config.customChannels.bypassRoleId)) return;

				options.push({
					label: currentMember.nickname ? currentMember.nickname : currentMember.user.username,
					value: currentMember.id,
				});
			});

			const responseMessage = await interaction.reply({
				content: 'Wähle hier den Nutzer aus, welchen du bannen möchtest.',
				components: [
					{
						type: 1,
						components: [
							{
								type: 3,
								custom_id: 'cc_ban_select',
								options: options,
							},
						],
					},
				],
				ephemeral: true,
				fetchReply: true,
			});

			responseMessage
				.awaitMessageComponent({ componentType: 'SELECT_MENU', time: 30000 })
				.then(async collectInteraction => {
					const banMember = collectInteraction.guild.members.cache.get(collectInteraction.values[0]);

					if (!banMember.voice.channelId || banMember.voice.channelId != customChannel.channelId) {
						interaction.editReply({
							content: ':x: Dieser Nutzer ist nicht in deinem Kanal!',
							components: [],
						});
						return;
					}

					const banMemberData = await UserData.findOne({
						where: {
							guildId: collectInteraction.guild.id,
							userId: banMember.user.id,
						},
						include: 'customChannelBans',
					});

					const ban = banMemberData.customChannelBans.find(x => x.customChannelId == customChannel.id);

					if (ban) {
						ban.destroy();

						channel.permissionOverwrites.edit(banMember.user.id, { CONNECT: null });
						interaction.editReply({
							content: ':white_check_mark: Der Nutzer wurde entbannt.',
							components: [],
						});
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

						interaction.editReply({
							content: ':white_check_mark: Der Nutzer wurde gebannt.',
							components: [],
						});
					}
				})
				.catch(error => {
					interaction.editReply({
						content: ':x: Die Zeit zum auswählen ist abgelaufen!',
						components: [],
					});
				});
		}
	},
};
