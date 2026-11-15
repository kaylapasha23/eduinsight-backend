import db from '../config/db';

// Interface untuk struktur data Evaluasi Mahasiswa
export interface EvaluasiItem {
  id?: number;
  class_id: number | string;
  student_name: string;
  nilai_akhir?: number | null;
  tren_kehadiran?: string | null;
  indikator_risiko?: string | null;
  insight_performa?: string | null;
  catatan_dosen?: string | null;
  date_text?: string | null;
  lecturer_name?: string | null;
  messages?: string | null;
  lecturer_note?: string | null;
  created_at?: string | Date;
}

// Interface untuk data masukan saat proses upsert
export interface UpsertEvaluasiDTO {
  class_id: number | string;
  student_name: string;
  nilai_akhir?: number | null;
  tren_kehadiran?: string | null;
  indikator_risiko?: string | null;
  insight_performa?: string | null;
  catatan_dosen?: string | null;
}

export const evaluasiModel = {
  // Mengambil data evaluasi berdasarkan kelas dan mahasiswa
  getByStudent: async (class_id: number | string, student_name: string): Promise<EvaluasiItem | undefined> => {
    const [rows] = (await db.query(
      'SELECT * FROM evaluasi_mahasiswa WHERE class_id = ? AND student_name = ?',
      [class_id, student_name]
    )) as [EvaluasiItem[], any];
    return rows[0]; 
  },

  // Menyimpan atau memperbarui hasil analisis AI & Catatan Dosen
  upsertEvaluasi: async (data: UpsertEvaluasiDTO): Promise<number> => {
    const { class_id, student_name, nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen } = data;
    
    // Cek apakah data untuk mahasiswa ini sudah ada
    const existing = await evaluasiModel.getByStudent(class_id, student_name);

    if (existing) {
      // Jika sudah ada, lakukan UPDATE (memperbarui catatan atau hasil analisis)
      const [result] = (await db.query(
        `UPDATE evaluasi_mahasiswa 
         SET nilai_akhir = COALESCE(?, nilai_akhir),
             tren_kehadiran = COALESCE(?, tren_kehadiran),
             indikator_risiko = COALESCE(?, indikator_risiko),
             insight_performa = COALESCE(?, insight_performa),
             catatan_dosen = COALESCE(?, catatan_dosen)
         WHERE class_id = ? AND student_name = ?`,
        [nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen, class_id, student_name]
      )) as [any, any];
      return result.affectedRows;
    } else {
      // Jika belum ada, lakukan INSERT data baru
      const [result] = (await db.query(
        `INSERT INTO evaluasi_mahasiswa (class_id, student_name, nilai_akhir, tren_kehadiran, indikator_risiko, insight_performa, catatan_dosen) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [class_id, student_name, nilai_akhir || null, tren_kehadiran || null, indikator_risiko || null, insight_performa || null, catatan_dosen || null]
      )) as [any, any];
      return result.insertId;
    }
  }
};

export default evaluasiModel;