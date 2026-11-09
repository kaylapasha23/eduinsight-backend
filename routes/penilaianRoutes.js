const express = require('express');
const router = express.Router();
const penilaianController = require('../controllers/penilaianController');
const { optionalAuthMiddleware, authMiddleware } = require('../middleware/authMiddleware');

router.get('/', optionalAuthMiddleware, penilaianController.getAllPenilaian);
router.post('/', authMiddleware, penilaianController.createPenilaian);
router.delete('/:id', authMiddleware, penilaianController.deletePenilaian);

module.exports = router;
