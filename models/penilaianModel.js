const db = require('../config/db');

const penilaianModel = {
  // Mengambil semua data penilaian
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM Penilaian');
    return rows;
  },

  // Menambahkan data penilaian baru
  create: async (data) => {
    const { class_id, student_name, task_name, score } = data;
    const [result] = await db.query(
      'INSERT INTO Penilaian (class_id, student_name, task_name, score) VALUES (?, ?, ?, ?)',
      [class_id, student_name, task_name, score]
    );
    return result.insertId;
  },

  // Menghapus data penilaian berdasarkan ID
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Penilaian WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = penilaianModel;