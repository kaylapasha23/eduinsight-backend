const evaluasiModel = require('../models/evaluasiModel');

// Ambil data evaluasi mahasiswa
exports.getEvaluasi = async (req, res) => {
  try {
    const { class_id, student_name } = req.query;
    const data = await evaluasiModel.getByStudent(class_id, student_name);
    
    if (!data) {
      return res.status(404).json({ success: false, message: 'Data evaluasi tidak ditemukan' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Simpan atau update analisis AI / catatan dosen
exports.saveEvaluasi = async (req, res) => {
  try {
    const { class_id, student_name, nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen } = req.body;

    if (!class_id || !student_name) {
      return res.status(400).json({ success: false, message: 'class_id dan student_name wajib diisi!' });
    }

    await evaluasiModel.upsertEvaluasi({
      class_id,
      student_name,
      nilai_akhir,
      tren_kehadiran,
      indikator_risiko,
      insight_performa,
      catatan_dosen
    });

    res.status(200).json({ success: true, message: 'Data evaluasi berhasil disimpan' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};