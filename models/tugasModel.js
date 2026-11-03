const db = require('../config/db');

const tugasModel = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM tugas');
    return rows;
  },

  create: async (data) => {
    const { class_id, title, description, deadline } = data;
    const [result] = await db.query(
      'INSERT INTO tugas (class_id, title, description, deadline) VALUES (?, ?, ?, ?)',
      [class_id, title, description, deadline]
    );
    return result.insertId;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM tugas WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = tugasModel;