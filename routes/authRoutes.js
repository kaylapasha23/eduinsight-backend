const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Cek & pastikan fungsi controller tersedia agar tidak crash
const register = authController.register || ((req, res) => res.status(501).json({ message: 'Register belum diimplementasi' }));
const login = authController.login || ((req, res) => res.status(501).json({ message: 'Login belum diimplementasi' }));
const logout = authController.logout || ((req, res) => res.status(200).json({ success: true, message: 'Logout berhasil' }));
const resetPassword = authController.resetPassword || ((req, res) => res.status(501).json({ message: 'Reset Password belum diimplementasi' }));
const getProfile = authController.getProfile || ((req, res) => res.status(501).json({ message: 'Profile belum diimplementasi' }));

// 2. Routing Auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.get('/profile', getProfile);

module.exports = router;