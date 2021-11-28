const express = require('express');
const checkAuth = require('../middleware/checkAuth.middleware');
const userController = require('../controllers/users.controllers');
const router = express.Router();

router.get('/@me', checkAuth, userController.getMe);

module.exports = router;
