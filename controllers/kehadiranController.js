const db = require('../data/database');

// GET /api/kehadiran
const getKehadiran = async (req, res) => {
  try {
    let dataKehadiran = [];

    // 1. Ambil data asli dari tabel kehadiran database db_eduinsight
    if (db && typeof db.query === 'function') {
      const [rows] = await db.query('SELECT * FROM kehadiran');
      dataKehadiran = rows;
    } else if (typeof db.getKehadiran === 'function') {
      dataKehadiran = db.getKehadiran();
    } else if (Array.isArray(db.kehadiran)) {
      dataKehadiran = db.kehadiran;
    }

    // 2. Format data agar memiliki NIM dummy jika di database belum ada kolom NIM
    const formattedData = dataKehadiran.map((item, index) => ({
      id: item.id,
      class_id: item.class_id,
      student_name: item.student_name,
      name: item.student_name,
      nim: item.nim || `22010100${index + 1}`,
      status: item.status || 'Hadir',
      date: item.date,
    }));

    return res.status(200).json({
      success: true,
      data: formattedData,
    });
  } catch (err) {
    console.error('[GET KEHADIRAN ERROR]:', err);
    return res.status(200).json({
      success: false,
      message: 'Gagal mengambil data kehadiran',
      error: err.message,
    });
  }
};

// POST /api/kehadiran
const createKehadiran = async (req, res) => {
  try {
    const { class_id, student_name, status, date } = req.body;

    const newDate = date || new Date().toISOString().split('T')[0];
    const newClassId = class_id || 2; // Default ke ID 2 sesuai database

    if (db && typeof db.query === 'function') {
      await db.query(
        'INSERT INTO kehadiran (class_id, student_name, status, date) VALUES (?, ?, ?, ?)',
        [newClassId, student_name, status, newDate]
      );
    } else if (Array.isArray(db.kehadiran)) {
      db.kehadiran.push({
        id: Date.now(),
        class_id: newClassId,
        student_name,
        status,
        date: newDate,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Data kehadiran berhasil disimpan ke database!',
    });
  } catch (err) {
    console.error('[CREATE KEHADIRAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal menyimpan kehadiran ke database',
      error: err.message,
    });
  }
};

module.exports = {
  getKehadiran,
  createKehadiran,
};