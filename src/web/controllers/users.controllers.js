const axios = require('axios');

const getMe = async (req, res) => {
	res.status(200).json(req.user);
};

module.exports = {
	getMe,
};
