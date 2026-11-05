const db = require('../config/db');

const ClassModel = {
  // Mengambil semua data kelas & jadwal
  getAll: async () => {
    const [rows] = await db.query(`
      SELECT 
        k.id,
        k.code,
        k.name,
        k.sks,
        k.semester,
        k.dosen_id,
        COALESCE(u.name, k.dosen_name) AS dosen_name,
        k.class_room,
        k.schedule_day,
        k.schedule_time,
        k.created_at
      FROM kelas k
      LEFT JOIN users u ON k.dosen_id = u.id
      ORDER BY FIELD(k.schedule_day, 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'), k.id ASC
    `);
    return rows;
  },

  // Mengambil kelas berdasarkan ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM kelas WHERE id = ?', [id]);
    return rows[0];
  },

  // Mengambil kelas berdasarkan hari jadwal (Filter Hari)
  getByDay: async (day) => {
    const [rows] = await db.query('SELECT * FROM kelas WHERE schedule_day = ?', [day]);
    return rows;
  },

  // Menambahkan data kelas baru
  create: async (data) => {
    const { code, name, sks, semester, dosen_id, dosen_name, class_room, schedule_day, schedule_time } = data;
    const [result] = await db.query(
      `INSERT INTO kelas (code, name, sks, semester, dosen_id, dosen_name, class_room, schedule_day, schedule_time) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, name, sks || 3, semester || 4, dosen_id || null, dosen_name || null, class_room, schedule_day, schedule_time]
    );
    return result.insertId;
  },

  // Menghapus data kelas
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM kelas WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = ClassModel;
