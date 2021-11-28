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

		req.user = userRes.data;
		next();
	}
	catch (err) {
		res.status(400).json({ error: 'middleware denied', message: 'auth failed' });
	}
};
