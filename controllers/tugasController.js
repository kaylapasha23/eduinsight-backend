const tugasModel = require('../models/tugasModel');

// Mengambil semua data tugas (opsional: filter ?category=segera / selesai)
exports.getAllTugas = async (req, res) => {
  try {
    const { category } = req.query;
    let list;
    if (category) {
      list = await tugasModel.getByCategory(category);
    } else {
      list = await tugasModel.getAll();
    }
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mengambil detail tugas berdasarkan ID
exports.getTugasById = async (req, res) => {
  try {
    const { id } = req.params;
    const tugas = await tugasModel.getById(id);
    if (!tugas) {
      return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    }
    res.status(200).json(tugas);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Menambah tugas baru
exports.createTugas = async (req, res) => {
  try {
    const { class_id, title, description, deadline, deadline_text, category, attachment_name } = req.body;

    if (!class_id || !title) {
      return res.status(400).json({ success: false, message: 'class_id dan title wajib diisi!' });
    }

    const finalDeadline = deadline_text || deadline || 'Hari ini, 23.59';

    const newId = await tugasModel.create({
      class_id,
      title,
      description,
      deadline_text: finalDeadline,
      category: category || 'segera',
      attachment_name: attachment_name || null
    });

    res.status(201).json({ success: true, message: 'Tugas berhasil ditambahkan', id: newId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Mengubah kategori / status tugas (misal diserahkan)
exports.updateTugasCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, message: 'Field category wajib diisi!' });
    }
    const affected = await tugasModel.updateCategory(id, category);
    if (affected === 0) {
      return res.status(404).json({ success: false, message: 'Tugas tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Status tugas berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Menghapus tugas
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
