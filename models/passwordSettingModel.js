const db = require('../config/db');

const passwordSettingsModel = {
  // Ambil data pengaturan berdasarkan dosen_id
  getByDosenId: async (dosen_id) => {
    const [rows] = await db.query(
      'SELECT * FROM password_setting WHERE dosen_id = ?',
      [dosen_id]
    );
    return rows[0];
  },

  // Simpan atau Perbarui kata sandi dan preferensi notifikasi secara otomatis
  upsertSettings: async (dosen_id, data) => {
    const { password_hash, notifikasi_email, notifikasi_sistem } = data;

    // Jika password_hash kosong (tidak ingin diubah), ambil password lama atau string kosong
    const [result] = await db.query(
      `INSERT INTO password_setting (dosen_id, password_hash, notifikasi_email, notifikasi_sistem)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         password_hash = COALESCE(?, password_hash),
         notifikasi_email = COALESCE(?, notifikasi_email),
         notifikasi_sistem = COALESCE(?, notifikasi_sistem)`,
      [
        dosen_id, 
        password_hash || '', 
        notifikasi_email ?? 1, 
        notifikasi_sistem ?? 1,
        password_hash, 
        notifikasi_email, 
        notifikasi_sistem
      ]
    );

    return result;
  }
};

module.exports = passwordSettingsModel;