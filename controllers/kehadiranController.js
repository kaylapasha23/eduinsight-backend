const kehadiranModel = require('../models/kehadiranModel'); 

// Ambil semua data kehadiran
exports.getAllKehadiran = async (req, res) => {
  try {
    const list = await kehadiranModel.getAll(); 
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tambah data kehadiran
exports.createKehadiran = async (req, res) => {
  try {
    const { class_id, student_name, status, date } = req.body;
    const newId = await kehadiranModel.create({ class_id, student_name, status, date });
    res.status(201).json({ success: true, message: 'Kehadiran berhasil ditambahkan', id: newId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hapus data kehadiran
exports.deleteKehadiran = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await kehadiranModel.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: `Kehadiran dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};