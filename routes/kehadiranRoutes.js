const express = require('express');
const router = express.Router();
const kehadiranController = require('../controllers/kehadiranController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, kehadiranController.getAllKehadiran);
router.post('/', authMiddleware, kehadiranController.createKehadiran);
router.delete('/:id', authMiddleware, kehadiranController.deleteKehadiran);

module.exports = router;