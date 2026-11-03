const ClassModel = require('../models/classModel');

// Mengambil semua data kelas
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await ClassModel.getAll();
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Menambah kelas baru
exports.createClass = async (req, res) => {
  try {
    const insertId = await ClassModel.create(req.body);
    res.status(201).json({ success: true, message: 'Kelas berhasil ditambahkan', id: insertId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Menghapus kelas berdasarkan ID
exports.deleteClass = async (req, res) => {
  try {
    const { id } = req.params; // Mengambil id dari parameter URL
    const affectedRows = await ClassModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data kelas tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: `Kelas dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};