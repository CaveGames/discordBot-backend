const axios = require('axios');
const config = require('../../../config.json');

const getMe = async (req, res) => {
	res.status(200).json(req.user);
};

const getGuilds = async (req, res) => {
	const userRes = await axios.get('https://discordapp.com/api/users/@me/guilds', {
		headers: {
			Authorization: req.get('authorization'),
		},
	});
	const userGuilds = userRes.data;

	const botRes = await axios.get('https://discordapp.com/api/users/@me/guilds', {
		headers: {
			Authorization: 'Bot ' + config.token,
		},
	});
	const botGuilds = botRes.data;

	const dcGuilds = userGuilds.filter(x => botGuilds.some(y => x.id === y.id));

	const guilds = [];
	dcGuilds.forEach(x => {
		guilds.push({
			id: x.id,
			name: x.name,
			icon: x.icon,
		});
	});

	res.status(200).json(guilds);
};

module.exports = {
	getMe,
	getGuilds,
};
