const defaultNilaiSemester = [
  {
    judul: 'Semester Enam',
    tahunAjaran: 'Genap Tahun Ajaran 2025/2026',
    ips: 3.78,
    totalSks: 22,
    matkul: [
      { nomor: 6, nama: 'Keamanan Siber', kode: 'VTI51322', sks: 4, grade: 'A+' },
      { nomor: 5, nama: 'Rekayasa Perangkat Lunak', kode: 'VTI51375', sks: 4, grade: 'A+' },
      { nomor: 4, nama: 'Sistem Informasi', kode: 'VTI51335', sks: 4, grade: 'B+' },
      { nomor: 3, nama: 'Statistika Komputasi', kode: 'VTI51389', sks: 4, grade: 'C+' },
      { nomor: 2, nama: 'Pemrograman Web', kode: 'VTI51329', sks: 4, grade: 'A+' },
      { nomor: 1, nama: 'Kecerdasan Buatan', kode: 'VTI51366', sks: 3, grade: 'A+' },
    ],
  },
  {
    judul: 'Semester Lima',
    tahunAjaran: 'Ganjil Tahun Ajaran 2025/2026',
    ips: 3.82,
    totalSks: 22,
    matkul: [
      { nomor: 5, nama: 'Kecerdasan Buatan', kode: 'VTI51366', sks: 4, grade: 'A+' },
      { nomor: 4, nama: 'Basis Data Terdistribusi', kode: 'VTI51250', sks: 4, grade: 'A' },
      { nomor: 3, nama: 'Jaringan Komputer', kode: 'VTI51220', sks: 4, grade: 'A+' },
      { nomor: 2, nama: 'Pemrograman Mobile', kode: 'VTI51310', sks: 4, grade: 'B+' },
      { nomor: 1, nama: 'Grafika Komputer', kode: 'VTI51290', sks: 3, grade: 'A' },
    ],
  },
  {
    judul: 'Semester Empat',
    tahunAjaran: 'Genap Tahun Ajaran 2024/2025',
    ips: 3.65,
    totalSks: 20,
    matkul: [
      { nomor: 5, nama: 'Pemrograman Berorientasi Objek', kode: 'VTI51210', sks: 4, grade: 'A+' },
      { nomor: 4, nama: 'Struktur Data & Algoritma', kode: 'VTI51215', sks: 4, grade: 'B+' },
      { nomor: 3, nama: 'Matematika Diskrit', kode: 'VTI51180', sks: 3, grade: 'A' },
      { nomor: 2, nama: 'Sistem Operasi', kode: 'VTI51230', sks: 4, grade: 'B+' },
      { nomor: 1, nama: 'Arsitektur Komputer', kode: 'VTI51205', sks: 3, grade: 'B' },
    ],
  },
];

// Ambil semua data penilaian semester
exports.getAllPenilaian = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: defaultNilaiSemester,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Tambah data penilaian
exports.createPenilaian = async (req, res) => {
  try {
    const { semester, nama, kode, sks, grade } = req.body;
    res.status(201).json({
      success: true,
      message: 'Data penilaian berhasil ditambahkan',
      data: { semester, nama, kode, sks, grade },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Hapus data penilaian
exports.deletePenilaian = async (req, res) => {
  res.status(200).json({ success: true, message: 'Data penilaian berhasil dihapus' });
};
