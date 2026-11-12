const db = require('../config/db');

// In-memory fallback for Classes when MySQL is offline
let fallbackClasses = [
  {
    id: 1,
    code: 'VTI51366',
    name: 'Kecerdasan Buatan',
    sks: 3,
    semester: 4,
    dosen_id: 3,
    dosen_name: 'Dr. Ahmad Sahroni, M.Kom.',
    class_room: 'Lantai 7, Ruangan 701',
    schedule_day: 'Senin',
    schedule_time: '14.00 - 15.20 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    code: 'VTI51329',
    name: 'Pemrograman Web',
    sks: 4,
    semester: 4,
    dosen_id: 4,
    dosen_name: 'Ir. Tri Astuti, M.T.',
    class_room: 'Lantai 5, Ruang 502',
    schedule_day: 'Selasa',
    schedule_time: '08.00 - 10.00 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    code: 'VTI51250',
    name: 'Basis Data Terdistribusi',
    sks: 4,
    semester: 4,
    dosen_id: 5,
    dosen_name: 'Teddy Indra Wijaya, M.Kom.',
    class_room: 'Lantai 6, Ruang 606',
    schedule_day: 'Rabu',
    schedule_time: '12.00 - 14.00 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    code: 'VTI51322',
    name: 'Keamanan Siber & Jaringan',
    sks: 4,
    semester: 4,
    dosen_id: 6,
    dosen_name: 'Prof. Bambang Hariyanto, Ph.D.',
    class_room: 'Lab Keamanan, Lantai 4',
    schedule_day: 'Kamis',
    schedule_time: '10.00 - 12.00 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    code: 'VTI51375',
    name: 'Rekayasa Perangkat Lunak',
    sks: 4,
    semester: 4,
    dosen_id: 7,
    dosen_name: 'Ivan Gunawan, M.Ds.',
    class_room: 'Lantai 3, Ruang 304',
    schedule_day: 'Jumat',
    schedule_time: '08.00 - 10.30 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    code: 'VTI51389',
    name: 'Statistika Komputasi',
    sks: 3,
    semester: 4,
    dosen_id: 3,
    dosen_name: 'Dr. Rini Handayani, M.M.',
    class_room: 'Lantai 4, Ruang 402',
    schedule_day: 'Jumat',
    schedule_time: '13.30 - 15.30 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    code: 'VTI51301',
    name: 'Kewirausahaan',
    sks: 2,
    semester: 4,
    dosen_id: 7,
    dosen_name: 'Dr. Rini Handayani, M.M.',
    class_room: 'Lantai 2, Ruang 201',
    schedule_day: 'Senin',
    schedule_time: '10.00 - 11.40 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 8,
    code: 'VTI51302',
    name: 'UI/UX Design',
    sks: 3,
    semester: 4,
    dosen_id: 7,
    dosen_name: 'Ivan Gunawan, M.Ds.',
    class_room: 'Lab Multimedia, Lantai 5',
    schedule_day: 'Selasa',
    schedule_time: '13.00 - 15.30 WIB',
    created_at: new Date().toISOString(),
  },
  {
    id: 9,
    code: 'VTI51303',
    name: 'Internet of Things (IoT)',
    sks: 3,
    semester: 4,
    dosen_id: 5,
    dosen_name: 'Teddy Indra Wijaya, M.Kom.',
    class_room: 'Lab IoT, Lantai 6',
    schedule_day: 'Rabu',
    schedule_time: '15.00 - 17.30 WIB',
    created_at: new Date().toISOString(),
  },
];

const ClassModel = {
  // Mengambil semua data kelas & jadwal
  getAll: async () => {
    try {
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
    } catch (_) {
      return fallbackClasses;
    }
  },

  // Mengambil kelas berdasarkan ID
  getById: async (id) => {
    try {
      const [rows] = await db.query('SELECT * FROM kelas WHERE id = ?', [id]);
      return rows[0];
    } catch (_) {
      return fallbackClasses.find((k) => k.id == id);
    }
  },

  // Mengambil kelas berdasarkan hari jadwal (Filter Hari)
  getByDay: async (day) => {
    try {
      const [rows] = await db.query('SELECT * FROM kelas WHERE schedule_day = ?', [day]);
      return rows;
    } catch (_) {
      return fallbackClasses.filter((k) => k.schedule_day === day);
    }
  },

  // Menambahkan data kelas baru
  create: async (data) => {
    const { code, name, sks, semester, dosen_id, dosen_name, class_room, schedule_day, schedule_time } = data;
    try {
      const [result] = await db.query(
        `INSERT INTO kelas (code, name, sks, semester, dosen_id, dosen_name, class_room, schedule_day, schedule_time) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [code, name, sks || 3, semester || 4, dosen_id || null, dosen_name || null, class_room, schedule_day, schedule_time]
      );
      return result.insertId;
    } catch (_) {
      const newId = fallbackClasses.length ? Math.max(...fallbackClasses.map((k) => k.id)) + 1 : 1;
      fallbackClasses.push({
        id: newId,
        code,
        name,
        sks: sks || 3,
        semester: semester || 4,
        dosen_id: dosen_id || null,
        dosen_name: dosen_name || 'Dosen Pengampu',
        class_room: class_room || 'Ruang Kuliah',
        schedule_day,
        schedule_time,
        created_at: new Date().toISOString(),
      });
      return newId;
    }
  },

  // Menghapus data kelas
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM kelas WHERE id = ?', [id]);
      return result.affectedRows;
    } catch (_) {
      const initLen = fallbackClasses.length;
      fallbackClasses = fallbackClasses.filter((k) => k.id != id);
      return initLen - fallbackClasses.length;
    }
  }
};

module.exports = ClassModel;
