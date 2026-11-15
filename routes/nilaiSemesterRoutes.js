const express = require('express');
const router = express.Router();
const { MASTER_NILAI_SEMESTER } = require('../data/database');

// GET /api/nilai-semester
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    data: MASTER_NILAI_SEMESTER,
  });
});

module.exports = router;

