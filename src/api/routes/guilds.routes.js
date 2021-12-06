const express = require('express');
const checkAuth = require('../middleware/checkAuth.middleware');
const guildController = require('../controllers/guilds.controllers');
const router = express.Router();

router.post('/:guildId/channels/:channelId/messages', checkAuth, guildController.SendMessage);

module.exports = router;
