const penilaianModel = require('../models/penilaianModel');

// Ambil semua data penilaian
exports.getAllPenilaian = async (req, res) => {
  try {
    const list = await penilaianModel.getAll();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tambah data penilaian
exports.createPenilaian = async (req, res) => {
  try {
    const { class_id, student_name, task_name, score } = req.body;

    if (!class_id || !student_name || !task_name || score === undefined) {
      return res.status(400).json({ success: false, message: 'class_id, student_name, task_name, dan score wajib diisi!' });
    }

    const newId = await penilaianModel.create({ class_id, student_name, task_name, score });
    res.status(201).json({ success: true, message: 'Data penilaian berhasil ditambahkan', id: newId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hapus data penilaian
exports.deletePenilaian = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await penilaianModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data penilaian tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: `Data penilaian dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};