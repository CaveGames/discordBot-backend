const { Util } = require('discord.js');
const emoji = require('emoji-dictionary');

const config = require('../../config.json');

module.exports = {
	command: 'send',
	onlyAdmin: true,

	async run(client, message, args) {
		if (args.length != 1) return;

		if (args[0] == 'rules') {
			rules(message);
			return;
		}
		if (args[0] == 'tickets') {
			tickets(message);
			return;
		}
		if (args[0] == 'customChannels') {
			customChannels(message);
			return;
		}
	},
};

const rules = async message => {
	const channel = message.guild.channels.cache.get(config.rules.channelId);
	const messages = await channel.messages.fetch();
	messages.forEach(msg => msg.delete());

	const chunks = Util.splitMessage(config.rules.text, { char: config.rules.paragraphSplitter });

	const embeds = [];
	chunks.forEach((chunk, i) =>
		embeds.push({
			title: 'Regelwerk im Discord | ' + (i + 1) + ' von ' + chunks.length,
			description: chunk,
			color: config.accentColor,
		}),
	);

	const acceptButton = {
		type: 1,
		components: [
			{
				type: 2,
				style: 3,
				label: 'Regeln akzeptieren',
				emoji: emoji.getUnicode('heavy_check_mark'),
				custom_id: 'accept_rules',
			},
		],
	};

	channel.send({
		embeds: embeds,
		components: config.rules.usingRulesSplash ? [] : [acceptButton],
	});
};

const tickets = async message => {
	const channel = message.guild.channels.cache.get(config.tickets.channelId);
	const messages = await channel.messages.fetch();
	messages.forEach(msg => msg.delete());

	if (config.tickets.categories.length > 1) {
		const options = [];
		config.tickets.categories.forEach((category, i) => {
			options.push({
				label: category.name,
				value: i.toString(),
				description: category.description,
				emoji: category.emoji != null ? emoji.getUnicode(category.emoji) : null,
			});
		});

		channel.send({
			embeds: [
				{
					title: 'Ticket System',
					description: 'Wähle hier das Ticket aus, welches du erstellen möchtest',
					color: config.accentColor,
				},
			],
			components: [
				{
					type: 1,
					components: [
						{
							type: 3,
							placeholder: 'Wähle eine Kategorie',
							custom_id: 'ticket_select',
							options: options,
						},
					],
				},
			],
		});
	}
	else if (config.tickets.categories.length == 1) {
		channel.send({
			embeds: [
				{
					title: 'Ticket System',
					description: 'Klicke auf den Knopf um ein Ticket zu öffnen',
					color: config.accentColor,
				},
			],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							style: 2,
							label: config.tickets.categories[0].name,
							emoji:
								config.tickets.categories[0].emoji != null
									? emoji.getUnicode(config.tickets.categories[0].emoji)
									: null,
							custom_id: 'ticket_select',
						},
					],
				},
			],
		});
	}
};

const customChannels = async message => {
	const channel = message.channel;
	const messages = await channel.messages.fetch();
	messages.forEach(msg => msg.delete());

	channel.send({
		embeds: [
			{
				title: 'Custom Channels',
				description:
					'Custom Channels sind die perfekte Lösung um ungestört mit deinen Freunden zu chillen.\n' +
					'Betritt den <#' +
					config.customChannels.channelId +
					'> Sprachkanal und erhalte deinen persönlichen, temporären Kanal, welchen du frei nach laune anpassen kannst.',
				color: config.accentColor,
			},
			{
				title: 'Funktionen',
				description:
					'**► Kanal-Infos**\n' +
					'Zeigt dir Infos über den Custom Channel, in welchem du dich aktuell befindest.\n\n' +
					'**► Nutzer kicken**\n' +
					'Werfe Störenfriede ganz einfach aus deinem Kanal.\n\n' +
					// '**► Nutzer bannen**\n' +
					// 'Wenn das raus werfen nicht reicht, dann sperre bestimmte Nutzer einfach komplett aus.\n\n' +
					'**► Privat / Öffentlich**\n' +
					'Sorge dafür, dass kein Nutzer deinen Kanal betreten darf.\n\n' +
					'**► Versteckt / Sichtbar**\n' +
					'Verstecke deinen Kanal vor anderen Nutzern.',
				color: config.accentColor,
			},
		],
		components: [
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 2,
						label: 'Kanal-Infos',
						custom_id: 'cc_info',
					},
				],
			},
			{
				type: 1,
				components: [
					{
						type: 2,
						style: 4,
						label: 'Nutzer kicken',
						custom_id: 'cc_kick',
					},
					// {
					// 	type: 2,
					// 	style: 4,
					// 	label: 'Nutzer bannen',
					// 	custom_id: 'cc_ban',
					// },
					{
						type: 2,
						style: 1,
						label: 'Privat / Öffentlich',
						custom_id: 'cc_private',
					},
					{
						type: 2,
						style: 1,
						label: 'Versteckt / Sichtbar',
						custom_id: 'cc_hide',
					},
				],
			},
		],
	});
};
