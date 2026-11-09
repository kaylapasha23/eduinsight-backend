const express = require('express');
const router = express.Router();
const passwordSettingsController = require('../controllers/passwordSettingsController');

// Menerima POST & PUT, serta mendukung akhiran / dan /settings
router.route('/')
  .post(passwordSettingsController.updatePasswordSettings)
  .put(passwordSettingsController.updatePasswordSettings);

module.exports = router;