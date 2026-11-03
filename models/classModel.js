const db = require('../config/db');

const ClassModel = {
  // Mengambil semua data kelas
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM Kelas');
    return rows;
  },

  // Menambahkan data kelas baru
  create: async (data) => {
    const { code, name, classRoom, schedule } = data;
    const [result] = await db.query(
      'INSERT INTO Kelas (code, name, classRoom, schedule) VALUES (?, ?, ?, ?)',
      [code, name, classRoom, schedule]
    );
    return result.insertId;
  },

  // Menghapus data kelas berdasarkan ID (BARU)
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Kelas WHERE id = ?', [id]);
    return result.affectedRows; // Mengembalikan jumlah baris yang terhapus
  }
};

module.exports = ClassModel;