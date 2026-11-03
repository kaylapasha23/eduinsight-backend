const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Endpoint GET & POST untuk Kelas (diproteksi authMiddleware)
router.get('/', authMiddleware, classController.getAllClasses);
router.post('/', authMiddleware, classController.createClass);
router.delete('/:id', authMiddleware, classController.deleteClass);

module.exports = router;