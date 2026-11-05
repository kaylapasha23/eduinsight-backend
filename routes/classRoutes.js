const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Endpoint GET, POST & DELETE untuk Kelas (diproteksi authMiddleware)
router.get('/', authMiddleware, classController.getAllClasses);
router.get('/:id', authMiddleware, classController.getClassById);
router.post('/', authMiddleware, classController.createClass);
router.delete('/:id', authMiddleware, classController.deleteClass);

module.exports = router;
