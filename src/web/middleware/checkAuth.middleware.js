const axios = require('axios');

module.exports = async (req, res, next) => {
	const token = req.get('authorization');

	if (!token) return res.status(400).json({ error: 'middleware denied', message: 'auth failed' });

	try {
		const userRes = await axios.get('https://discordapp.com/api/users/@me', {
			headers: {
				Authorization: req.get('authorization'),
			},
		});

		const user = {};
		user.id = userRes.data.id;
		user.username = userRes.data.username;
		user.avatar = userRes.data.avatar;
		user.discriminator = userRes.data.discriminator;

		req.user = user;
		next();
	}
	catch (err) {
		res.status(400).json({ error: 'middleware denied', message: 'auth failed' });
	}
};
