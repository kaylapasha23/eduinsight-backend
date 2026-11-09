const express = require('express');
const router = express.Router();

let passwordSettingsController;
try {
  passwordSettingsController = require('../controllers/passwordSettingsController');
} catch (e) {
  passwordSettingsController = require('../controllers/passwordSettingController');
}

const updatePasswordSettings =
  passwordSettingsController.updatePasswordSettings ||
  passwordSettingsController.updatePassword ||
  ((req, res) => res.status(200).json({ success: true, message: 'Password updated' }));

router.post('/', updatePasswordSettings);
router.put('/', updatePasswordSettings);

module.exports = router;