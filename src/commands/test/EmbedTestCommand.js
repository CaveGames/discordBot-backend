const { MessageAttachment, MessageEmbed } = require('discord.js');
const axios = require('axios');
const Canvas = require('canvas');

module.exports = {
	command: 'embedTest',

	async run(client, message, args) {
		// message.channel.send('EmbedTest command works');

		var user = message.mentions.users.first();
		if (!user) user = message.author;

		const { avatar, banner, accent_color } = await axios
			.get(`https://discord.com/api/users/${user.id}`, {
				headers: {
					Authorization: `Bot ${client.token}`,
				},
			})
			.then(res => {
				return res.data;
			});

		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');

		if (accent_color) {
			var hex = Number(accent_color).toString(16);
			if (hex.length < 2) {
				hex = '0' + hex;
			}
			context.strokeStyle = `#${hex}`;
			context.fillStyle = `#${hex}`;
		} else {
			context.strokeStyle = '#6441A5';
			context.fillStyle = '#6441A5';
		}

		if (banner) {
			const background = await Canvas.loadImage(`https://cdn.discordapp.com/banners/${user.id}/${banner}.png?size=512`);
			const scale = Math.max(canvas.width / background.width, canvas.height / background.height);
			var x = canvas.width / 2 - (background.width / 2) * scale;
			var y = canvas.height / 2 - (background.height / 2) * scale;
			context.drawImage(background, x, y, background.width * scale, background.height * scale);
		} else {
			context.fillRect(0, 0, canvas.width, canvas.height);
		}

		var avatarCan = '';
		if (avatar) {
			avatarCan = await Canvas.loadImage(`https://cdn.discordapp.com/avatars/${user.id}/${avatar}.png?size=256`);
		} else {
			avatarCan = await Canvas.loadImage('https://cdn.discordapp.com/embed/avatars/0.png');
		}

		context.beginPath();
		context.arc(canvas.width / 2, canvas.height / 2, 105, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		context.fillRect((canvas.width - 200) / 2 - 5, (canvas.height - 200) / 2 - 5, 210, 210);
		context.restore();

		context.beginPath();
		context.arc(canvas.width / 2, canvas.height / 2, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		context.drawImage(avatarCan, (canvas.width - 200) / 2, (canvas.height - 200) / 2, 200, 200);
		context.restore();

		const attachment = new MessageAttachment(canvas.toBuffer(), 'image.png');
		const exampleEmbed = new MessageEmbed()
			.setColor('#6441A5')
			.setTitle(`Willkommen ${user.username}`)
			.setImage('attachment://image.png');

		if (accent_color) {
			exampleEmbed.setColor(accent_color);
		}

		message.channel.send({ embeds: [exampleEmbed], files: [attachment] });
	},
};
