const db = require('../config/db');

const kehadiranModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM Kehadiran');
    return rows;
  },

  create: async (data) => {
    const { class_id, student_name, status, date } = data;
    const [result] = await db.query(
      'INSERT INTO Kehadiran (class_id, student_name, status, date) VALUES (?, ?, ?, ?)',
      [class_id, student_name, status, date]
    );
    return result.insertId;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM Kehadiran WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = kehadiranModel;