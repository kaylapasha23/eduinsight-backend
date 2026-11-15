import db from '../config/db';

// Interface untuk struktur data Penilaian
export interface PenilaianItem {
  id: number;
  class_id: number | string;
  student_name: string;
  task_name: string;
  score: number;
  created_at?: string | Date;
}

// Interface untuk data masukan saat membuat penilaian baru
export interface CreatePenilaianDTO {
  class_id: number | string;
  student_name: string;
  task_name: string;
  score: number;
}

export const penilaianModel = {
  // Mengambil semua data penilaian
  getAll: async (): Promise<PenilaianItem[]> => {
    const [rows] = (await db.query('SELECT * FROM Penilaian')) as [PenilaianItem[], any];
    return rows;
  },

  // Menambahkan data penilaian baru
  create: async (data: CreatePenilaianDTO): Promise<number> => {
    const { class_id, student_name, task_name, score } = data;
    const [result] = (await db.query(
      'INSERT INTO Penilaian (class_id, student_name, task_name, score) VALUES (?, ?, ?, ?)',
      [class_id, student_name, task_name, score]
    )) as [any, any];
    return result.insertId;
  },

  // Menghapus data penilaian berdasarkan ID
  delete: async (id: number | string): Promise<number> => {
    const [result] = (await db.query('DELETE FROM Penilaian WHERE id = ?', [id])) as [any, any];
    return result.affectedRows;
  }
};

export default penilaianModel;