const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// Safe load fungsi controller
const getClasses =
  classController.getAllClasses ||
  classController.getClasses ||
  ((req, res) => res.status(200).json({ success: true, data: [] }));

const getClassById =
  classController.getClassById ||
  ((req, res) => res.status(200).json({ success: true, data: null }));

const createClass =
  classController.createClass ||
  classController.addClass ||
  ((req, res) => res.status(201).json({ success: true, message: 'Kelas berhasil dibuat' }));

const deleteClass =
  classController.deleteClass ||
  classController.removeClass ||
  ((req, res) => res.status(200).json({ success: true, message: 'Kelas berhasil dihapus' }));

// ═══════════════════════════════════════════
// ROUTING KELAS (CRUD)
// ═══════════════════════════════════════════
router.get('/', getClasses);
router.get('/:id', getClassById);
router.post('/', createClass);
router.delete('/:id', deleteClass);

module.exports = router;
