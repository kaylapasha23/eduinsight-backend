const tugasModel = require('../models/tugasModel');

exports.getAllTugas = async (req, res) => {
  try {
    const list = await tugasModel.getAll();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.createTugas = async (req, res) => {
  try {
    const { class_id, title, description, deadline } = req.body;

    if (!class_id || !title || !deadline) {
      return res.status(400).json({ success: false, message: 'class_id, title, dan deadline wajib diisi!' });
    }

    const newId = await tugasModel.create({ class_id, title, description, deadline });
    res.status(201).json({ success: true, message: 'Tugas berhasil ditambahkan', id: newId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteTugas = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await tugasModel.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    }

    res.status(200).json({ success: true, message: `Tugas dengan ID ${id} berhasil dihapus` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};