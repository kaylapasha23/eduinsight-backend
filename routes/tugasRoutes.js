const express = require('express');
const router = express.Router();
const tugasController = require('../controllers/tugasController');
const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.get('/', optionalAuthMiddleware, tugasController.getAllTugas);
router.get('/:id', optionalAuthMiddleware, tugasController.getTugasById);
router.post('/', authMiddleware, tugasController.createTugas);
router.patch('/:id/category', authMiddleware, tugasController.updateTugasCategory);
router.delete('/:id', authMiddleware, tugasController.deleteTugas);

module.exports = router;
