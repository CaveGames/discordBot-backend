const express = require('express');
const checkAuth = require('../middleware/checkAuth.middleware');
const checkAdminRole = require('../middleware/checkAdminRole.middleware');
const guildController = require('../controllers/guilds.controllers');
const router = express.Router();

router.post('/:guildId/channels/:channelId/messages', [checkAuth, checkAdminRole], guildController.SendMessage);

module.exports = router;
