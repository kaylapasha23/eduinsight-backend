const database = require('../data/database');

// GET /api/kehadiran
const getKehadiran = async (req, res) => {
  try {
    let dataKehadiran = [];

    // 1. Jika terhubung ke MySQL (dengan JOIN tabel users/mahasiswa)
    if (database && typeof database.query === 'function') {
      const [rows] = await database.query(`
        SELECT 
          k.id, 
          k.status, 
          k.tanggal, 
          COALESCE(u.name, k.student_name, 'Mahasiswa') AS student_name,
          COALESCE(u.nim, k.nim, '220101001') AS nim
        FROM kehadiran k
        LEFT JOIN users u ON k.mahasiswa_id = u.id
      `);
      dataKehadiran = rows;
    } 
    // 2. Jika menggunakan helper/array memory
    else if (typeof database.getKehadiran === 'function') {
      dataKehadiran = database.getKehadiran();
    } else if (Array.isArray(database.kehadiran)) {
      dataKehadiran = database.kehadiran;
    }

    // Default dummy dari backend jika database masih kosong
    if (!dataKehadiran || dataKehadiran.length === 0) {
      dataKehadiran = [
        { id: 'khd-1', nim: '220101001', student_name: 'Budi Santoso', status: 'Hadir' },
        { id: 'khd-2', nim: '220101002', student_name: 'Siti Rahmawati', status: 'Hadir' },
        { id: 'khd-3', nim: '220101003', student_name: 'Ahmad Dahlan', status: 'Izin' },
      ];
    }

    return res.status(200).json({
      success: true,
      data: dataKehadiran,
    });
  } catch (err) {
    console.error('[GET KEHADIRAN ERROR]:', err);
    return res.status(200).json({ success: true, data: [] });
  }
};

// POST /api/kehadiran
const createKehadiran = async (req, res) => {
  try {
    const { student_name, status, class_id, nim } = req.body;

    const newRecord = {
      id: `khd-${Date.now()}`,
      student_name,
      nim: nim || '220101001',
      status: status || 'Hadir',
      class_id: class_id || 1,
      tanggal: new Date().toISOString().split('T')[0],
    };

    if (database && typeof database.query === 'function') {
      await database.query(
        'INSERT INTO kehadiran (id, student_name, status, tanggal) VALUES (?, ?, ?, ?)',
        [newRecord.id, newRecord.student_name, newRecord.status, newRecord.tanggal]
      );
    } else if (Array.isArray(database.kehadiran)) {
      database.kehadiran.push(newRecord);
    }

    return res.status(201).json({
      success: true,
      message: 'Presensi berhasil disimpan',
      data: newRecord,
    });
  } catch (err) {
    console.error('[SAVE KEHADIRAN ERROR]:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getKehadiran,
  createKehadiran,
};