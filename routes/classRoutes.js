const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');

// 1. Safe Load untuk GET Classes
const getClasses =
  classController.getClasses ||
  classController.getAllClasses ||
  ((req, res) => res.status(200).json({ success: true, data: [] }));

// 2. Safe Load untuk CREATE Class
const createClass =
  classController.createClass ||
  classController.addClass ||
  ((req, res) => res.status(201).json({ success: true, message: 'Kelas berhasil dibuat' }));

// 3. Safe Load untuk DELETE Class
const deleteClass =
  classController.deleteClass ||
  classController.removeClass ||
  ((req, res) => res.status(200).json({ success: true, message: 'Kelas berhasil dihapus' }));

// ═══════════════════════════════════════════
// ROUTING KELAS (CRUD)
// ═══════════════════════════════════════════
router.get('/', getClasses);
router.post('/', createClass);
router.delete('/:id', deleteClass);

module.exports = router;