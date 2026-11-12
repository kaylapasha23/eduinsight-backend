const express = require('express');
const router = express.Router();
const evaluasiController = require('../controllers/evaluasiController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, evaluasiController.getEvaluasi);
router.post('/', authMiddleware, evaluasiController.saveEvaluasi);

module.exports = router;