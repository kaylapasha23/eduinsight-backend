import db from '../config/db';

// Interface untuk struktur data Kehadiran
export interface KehadiranItem {
  id: number;
  class_id: number | string;
  student_name: string;
  status: string;
  date: string | Date;
  created_at?: string | Date;
}

// Interface untuk data saat pembuatan (create) kehadiran baru
export interface CreateKehadiranDTO {
  class_id: number | string;
  student_name: string;
  status: string;
  date: string | Date;
}

export const kehadiranModel = {
  getAll: async (): Promise<KehadiranItem[]> => {
    const [rows] = (await db.query('SELECT * FROM Kehadiran')) as [KehadiranItem[], any];
    return rows;
  },

  create: async (data: CreateKehadiranDTO): Promise<number> => {
    const { class_id, student_name, status, date } = data;
    const [result] = (await db.query(
      'INSERT INTO Kehadiran (class_id, student_name, status, date) VALUES (?, ?, ?, ?)',
      [class_id, student_name, status, date]
    )) as [any, any];
    return result.insertId;
  },

  delete: async (id: number | string): Promise<number> => {
    const [result] = (await db.query('DELETE FROM Kehadiran WHERE id = ?', [id])) as [any, any];
    return result.affectedRows;
  }
};

export default kehadiranModel;