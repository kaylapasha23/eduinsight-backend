const db = require('../config/db');

// In-memory / file fallback data for Tugas when MySQL is offline
let fallbackTugas = [
  {
    id: 1,
    class_id: 7,
    class_name: 'Kewirausahaan',
    class_code: 'VTI51301',
    dosen_name: 'Dr. Rini Handayani, M.M.',
    title: 'Tugas 1 - Quiziz',
    description: 'Kerjakan kuis mingguan melalui platform Quiziz dengan materi Bab 1 - 3.',
    deadline_text: 'Hari ini, 23.59',
    category: 'segera',
    attachment_name: 'Panduan_Kuis_Kwu.pdf',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    class_id: 8,
    class_name: 'UI/UX Design',
    class_code: 'VTI51302',
    dosen_name: 'Ivan Gunawan, M.Ds.',
    title: 'Tugas 1 - Analisa Aplikasi',
    description: 'Lakukan analisis usability dan heuristik pada salah satu aplikasi mobile e-commerce.',
    deadline_text: 'Hari ini, 23.59',
    category: 'segera',
    attachment_name: 'Template_Analisa_UIUX.docx',
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    class_id: 9,
    class_name: 'Internet of Things (IoT)',
    class_code: 'VTI51303',
    dosen_name: 'Teddy Indra Wijaya, M.Kom.',
    title: 'Pertemuan Pertama',
    description: 'Pelajari modul arsitektur IoT dan sensor, rangkum dalam format PDF 2 halaman.',
    deadline_text: 'Rabu, 23.59',
    category: 'segera',
    attachment_name: 'Modul_IoT_Dasar.pdf',
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    class_id: 1,
    class_name: 'Kecerdasan Buatan',
    class_code: 'VTI51366',
    dosen_name: 'Dr. Ahmad Sahroni, M.Kom.',
    title: 'Tugas Pengenalan AI',
    description: 'Resume sejarah AI dan perbedaan metode klasifikasi modern.',
    deadline_text: 'Diserahkan',
    category: 'selesai',
    attachment_name: 'Materi_Intro_AI.pdf',
    created_at: new Date().toISOString(),
  },
  {
    id: 5,
    class_id: 3,
    class_name: 'Basis Data',
    class_code: 'VTI51250',
    dosen_name: 'Teddy Indra Wijaya, M.Kom.',
    title: 'Latihan SQL Dasar',
    description: 'Latihan query DDL dan DML pada skema database perpustakaan kampus.',
    deadline_text: 'Diserahkan',
    category: 'selesai',
    attachment_name: 'Soal_SQL_Lab.sql',
    created_at: new Date().toISOString(),
  },
  {
    id: 6,
    class_id: 2,
    class_name: 'Pemrograman Web',
    class_code: 'VTI51329',
    dosen_name: 'Ir. Tri Astuti, M.T.',
    title: 'Tugas Array & Function',
    description: 'Implementasi algoritma pemrosesan array dan fungsi rekursif JavaScript.',
    deadline_text: 'Diserahkan',
    category: 'selesai',
    attachment_name: 'Tugas_JS_Array.pdf',
    created_at: new Date().toISOString(),
  },
  {
    id: 7,
    class_id: 9,
    class_name: 'Internet of Things (IoT)',
    class_code: 'VTI51303',
    dosen_name: 'Teddy Indra Wijaya, M.Kom.',
    title: 'Laporan Praktikum 1',
    description: 'Laporan instalasi mikrokontroler ESP32 dan pembacaan sensor DHT11.',
    deadline_text: 'Diserahkan',
    category: 'selesai',
    attachment_name: 'Format_Laporan_IoT.docx',
    created_at: new Date().toISOString(),
  },
];

const tugasModel = {
  // Mengambil semua data tugas dengan relasi nama kelas/mata kuliah
  getAll: async () => {
    try {
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
    } catch (_) {
      return fallbackTugas;
    }
  },

  // Mengambil tugas berdasarkan ID
  getById: async (id) => {
    try {
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
    } catch (_) {
      return fallbackTugas.find((t) => t.id == id);
    }
  },

  // Mengambil tugas berdasarkan kategori (segera, selesai, terlambat)
  getByCategory: async (category) => {
    try {
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
    } catch (_) {
      return fallbackTugas.filter((t) => t.category === category);
    }
  },

  // Menambahkan data tugas baru
  create: async (data) => {
    const { class_id, title, description, deadline_text, category, attachment_name } = data;
    try {
      const [result] = await db.query(
        `INSERT INTO tugas (class_id, title, description, deadline_text, category, attachment_name) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [class_id, title, description, deadline_text || 'Hari ini, 23.59', category || 'segera', attachment_name || null]
      );
      return result.insertId;
    } catch (_) {
      const newId = fallbackTugas.length ? Math.max(...fallbackTugas.map((t) => t.id)) + 1 : 1;
      fallbackTugas.push({
        id: newId,
        class_id,
        class_name: 'Mata Kuliah',
        title,
        description,
        deadline_text: deadline_text || 'Hari ini, 23.59',
        category: category || 'segera',
        attachment_name: attachment_name || null,
        created_at: new Date().toISOString(),
      });
      return newId;
    }
  },

  // Mengubah status tugas (misal: selesai / diserahkan)
  updateCategory: async (id, category) => {
    try {
      const [result] = await db.query(
        'UPDATE tugas SET category = ? WHERE id = ?',
        [category, id]
      );
      return result.affectedRows;
    } catch (_) {
      const item = fallbackTugas.find((t) => t.id == id);
      if (item) {
        item.category = category;
        return 1;
      }
      return 0;
    }
  },

  // Menghapus data tugas
  delete: async (id) => {
    try {
      const [result] = await db.query('DELETE FROM tugas WHERE id = ?', [id]);
      return result.affectedRows;
    } catch (_) {
      const initLen = fallbackTugas.length;
      fallbackTugas = fallbackTugas.filter((t) => t.id != id);
      return initLen - fallbackTugas.length;
    }
  }
};

module.exports = tugasModel;
