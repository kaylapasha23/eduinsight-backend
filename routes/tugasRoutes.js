const express = require('express');
const router = express.Router();
const tugasController = require('../controllers/tugasController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, tugasController.getAllTugas);
router.post('/', authMiddleware, tugasController.createTugas);
router.delete('/:id', authMiddleware, tugasController.deleteTugas);

module.exports = router;