const db = require('../config/db');

const tugasModel = {
  // Mengambil semua data tugas dengan relasi nama kelas/mata kuliah
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        t.id,
        t.class_id,
        k.name AS class_name,
        k.code AS class_code,
        k.dosen_name,
        t.title,
        t.description,
        t.deadline_text,
        t.category,
        t.attachment_name,
        t.created_at
      FROM tugas t
      LEFT JOIN kelas k ON t.class_id = k.id
      ORDER BY t.id ASC
    `);
    return rows;
  },

  // Mengambil tugas berdasarkan ID
  getById: async (id) => {
    const [rows] = await db.query(`
      SELECT 
        t.*,
        k.name AS class_name,
        k.code AS class_code,
        k.dosen_name
      FROM tugas t
      LEFT JOIN kelas k ON t.class_id = k.id
      WHERE t.id = ?
    `, [id]);
    return rows[0];
  },

  // Mengambil tugas berdasarkan kategori (segera, selesai, terlambat)
  getByCategory: async (category) => {
    const [rows] = await db.query(`
      SELECT 
        t.*,
        k.name AS class_name,
        k.code AS class_code
      FROM tugas t
      LEFT JOIN kelas k ON t.class_id = k.id
      WHERE t.category = ?
      ORDER BY t.id ASC
    `, [category]);
    return rows;
  },

  // Menambahkan data tugas baru
  create: async (data) => {
    const { class_id, title, description, deadline_text, category, attachment_name } = data;
    const [result] = await db.query(
      `INSERT INTO tugas (class_id, title, description, deadline_text, category, attachment_name) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [class_id, title, description, deadline_text || 'Hari ini, 23.59', category || 'segera', attachment_name || null]
    );
    return result.insertId;
  },

  // Mengubah status tugas (misal: selesai / diserahkan)
  updateCategory: async (id, category) => {
    const [result] = await db.query(
      'UPDATE tugas SET category = ? WHERE id = ?',
      [category, id]
    );
    return result.affectedRows;
  },

  // Menghapus data tugas
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM tugas WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = tugasModel;
