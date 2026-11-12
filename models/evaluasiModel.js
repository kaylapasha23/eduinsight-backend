const db = require('../config/db');

const evaluasiModel = {
  // Mengambil data evaluasi berdasarkan kelas dan mahasiswa
  getByStudent: async (class_id, student_name) => {
    const [rows] = await db.query(
      'SELECT * FROM evaluasi_mahasiswa WHERE class_id = ? AND student_name = ?',
      [class_id, student_name]
    );
    return rows[0]; 
  },

  // Menyimpan atau memperbarui hasil analisis AI & Catatan Dosen
  upsertEvaluasi: async (data) => {
    const { class_id, student_name, nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen } = data;
    
    // Cek apakah data untuk mahasiswa ini sudah ada
    const existing = await evaluasiModel.getByStudent(class_id, student_name);

    if (existing) {
      // Jika sudah ada, lakukan UPDATE (misal memperbarui catatan atau hasil analisis)
      const [result] = await db.query(
        `UPDATE evaluasi_mahasiswa 
         SET nilai_akhir = COALESCE(?, nilai_akhir),
             tren_kehadiran = COALESCE(?, tren_kehadiran),
             indikator_risiko = COALESCE(?, indikator_risiko),
             insight_performa = COALESCE(?, insight_performa),
             catatan_dosen = COALESCE(?, catatan_dosen)
         WHERE class_id = ? AND student_name = ?`,
        [nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen, class_id, student_name]
      );
      return result.affectedRows;
    } else {
      // Jika belum ada, lakukan INSERT data baru
      const [result] = await db.query(
        `INSERT INTO evaluasi_mahasiswa (class_id, student_name, nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [class_id, student_name, nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen]
      );
      return result.insertId;
    }
  }
};

module.exports = evaluasiModel;