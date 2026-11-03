const express = require('express');
const router = express.Router();
const passwordSettingsController = require('../controllers/passwordSettingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, passwordSettingsController.updatePasswordSettings);

module.exports = router;