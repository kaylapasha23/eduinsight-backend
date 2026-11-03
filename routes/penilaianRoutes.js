const express = require('express');
const router = express.Router();
const penilaianController = require('../controllers/penilaianController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, penilaianController.getAllPenilaian);
router.post('/', authMiddleware, penilaianController.createPenilaian);
router.delete('/:id', authMiddleware, penilaianController.deletePenilaian);

module.exports = router;