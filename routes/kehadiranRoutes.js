const express = require('express');
const router = express.Router();
const kehadiranController = require('../controllers/kehadiranController');
const { optionalAuthMiddleware, authMiddleware } = require('../middleware/authMiddleware');

router.get('/', optionalAuthMiddleware, kehadiranController.getKehadiran);
router.post('/', authMiddleware, kehadiranController.createKehadiran);
router.delete('/:id', authMiddleware, kehadiranController.deleteKehadiran);

module.exports = router;
