const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// 1. Data Users Dummy (Gabungan Mobile Frontend + Web Frontend Dosen/Mahasiswa)
const DEFAULT_USERS = [
  {
    id: 'user-mhs-001',
    name: 'Nama Mahasiswa',
    email: 'mahasiswa@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '19746713498174',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-14T15:28:13.530Z',
  },
  {
    id: 'user-mhs-brooke',
    name: 'Brooke Everly',
    email: 'brookeverly17@eduinsight.student.ac.id',
    alternativeEmails: ['brooke.everly@eduinsight.ac.id', 'brookeverly17@eduinsight.mail.com'],
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '254076512225017',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-24T16:18:50.615Z',
  },
  {
    id: 'user-mhs-chris',
    name: 'Chris Redfield',
    email: 'redchris@gmail.com',
    alternativeEmails: ['chris.redfield@eduinsight.student.ac.id', 'chris@eduinsight.ac.id'],
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '254076512225018',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-25T00:51:53.109Z',
  },
  {
    id: 'user-mhs-002',
    name: 'Mahasiswa FILKOM',
    email: 'mahasiswa@gmail.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '19746713498175',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-14T15:28:13.659Z',
  },
  // Mahasiswa Sheren Annabelle dari Web
  {
    id: 'user-mhs-sheren',
    name: 'Sheren Annabelle',
    email: 'sheren@eduinsight.student.ac.id',
    alternativeEmails: ['sheren@gmail.com'],
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '220101001',
    angkatan: '2023',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-14T15:28:13.659Z',
  },
  {
    id: 'user-dsn-001',
    name: 'Dr. Ahmad Sahroni, M.Kom.',
    email: 'dosen@eduinsight.ac.id',
    alternativeEmails: ['sahroni@eduinsight.ac.id'],
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '198503152010121002',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Kecerdasan Buatan', 'Pemrograman Framework'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-dsn-002',
    name: 'Ir. Tri Astuti, M.T.',
    email: 'triastuti@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '198204122008122001',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Pemrograman Web'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-dsn-003',
    name: 'Teddy Indra Wijaya, M.Kom.',
    email: 'teddy@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '198709232014041001',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Basis Data Terdistribusi', 'Internet of Things (IoT)'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-dsn-004',
    name: 'Prof. Bambang Hariyanto, Ph.D.',
    email: 'bambang@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '197105151998031002',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Keamanan Siber & Jaringan'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-dsn-005',
    name: 'Ivan Gunawan, M.Ds.',
    email: 'ivangunawan@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '198911202015041003',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Rekayasa Perangkat Lunak', 'UI/UX Design'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-dsn-006',
    name: 'Dra. Endang Sulistyo, M.Stat.',
    email: 'endang@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '196802101993032001',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Statistika Komputasi'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-dsn-007',
    name: 'Dr. Rini Handayani, M.M.',
    email: 'rinihandayani@eduinsight.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'dosen',
    nip: '197906142005012003',
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    mataKuliah: ['Kewirausahaan'],
    createdAt: '2026-10-14T15:28:13.802Z',
  },
  {
    id: 'user-adm-001',
    name: 'Administrator Akademik',
    email: 'admin@eduinsight.ac.id',
    password: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    createdAt: '2026-10-14T15:28:13.936Z',
  },
];

// 2. Data Master Mata Kuliah (Mobile + Web)
const MASTER_MATKUL = [
  { id: 'mk-ai', kode: 'VTI51366', nama: 'Kecerdasan Buatan', sks: 3 },
  { id: 'mk-web', kode: 'VTI51329', nama: 'Pemrograman Web', sks: 4 },
  { id: 'mk-basdat', kode: 'VTI51250', nama: 'Basis Data Terdistribusi', sks: 4 },
  { id: 'mk-cyber', kode: 'VTI51322', nama: 'Keamanan Siber & Jaringan', sks: 4 },
  { id: 'mk-rpl', kode: 'VTI51375', nama: 'Rekayasa Perangkat Lunak', sks: 4 },
  { id: 'mk-stat', kode: 'VTI51389', nama: 'Statistika Komputasi', sks: 3 },
  { id: 'mk-kwu', kode: 'VTI51310', nama: 'Kewirausahaan', sks: 2 },
  { id: 'mk-uiux', kode: 'VTI51315', nama: 'UI/UX Design', sks: 3 },
  { id: 'mk-iot', kode: 'VTI51340', nama: 'Internet of Things (IoT)', sks: 3 },
  // Dari db_eduinsight Web:
  { id: 'mk-pfa', kode: 'PFA3', nama: 'Pemrograman Framework', sks: 3 },
];

// 3. Data Master Kelas (Mobile + Web)
const MASTER_KELAS = [
  {
    id: 'kelas-ai',
    kodeGabung: 'VTI51366',
    ruangan: 'Lantai 7, Ruangan 701',
    hari: 'Senin',
    jamMulai: '14.00',
    jamSelesai: '15.20',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51366',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-web',
    kodeGabung: 'VTI51329',
    ruangan: 'Lantai 5, Ruang 502',
    hari: 'Selasa',
    jamMulai: '08.00',
    jamSelesai: '10.00',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51329',
    dosenNip: '198204122008122001',
  },
  {
    id: 'kelas-basdat',
    kodeGabung: 'VTI51250',
    ruangan: 'Lantai 6, Ruang 606',
    hari: 'Rabu',
    jamMulai: '12.00',
    jamSelesai: '14.00',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51250',
    dosenNip: '198709232014041001',
  },
  {
    id: 'kelas-cyber',
    kodeGabung: 'VTI51322',
    ruangan: 'Lab Keamanan, Lantai 4',
    hari: 'Kamis',
    jamMulai: '10.00',
    jamSelesai: '12.00',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51322',
    dosenNip: '197105151998031002',
  },
  {
    id: 'kelas-rpl',
    kodeGabung: 'VTI51375',
    ruangan: 'Lantai 3, Ruang 304',
    hari: 'Jumat',
    jamMulai: '08.00',
    jamSelesai: '10.30',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51375',
    dosenNip: '198911202015041003',
  },
  {
    id: 'kelas-stat',
    kodeGabung: 'VTI51389',
    ruangan: 'Lantai 2, Ruang 201',
    hari: 'Jumat',
    jamMulai: '13.30',
    jamSelesai: '15.00',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51389',
    dosenNip: '196802101993032001',
  },
  {
    id: 'kelas-kwu',
    kodeGabung: 'VTI51310',
    ruangan: 'Lantai 4, Ruang 401',
    hari: 'Senin',
    jamMulai: '08.00',
    jamSelesai: '09.40',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51310',
    dosenNip: '197906142005012003',
  },
  {
    id: 'kelas-uiux',
    kodeGabung: 'VTI51315',
    ruangan: 'Lab Multimedia, Lantai 3',
    hari: 'Selasa',
    jamMulai: '13.00',
    jamSelesai: '15.30',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51315',
    dosenNip: '198911202015041003',
  },
  {
    id: 'kelas-iot',
    kodeGabung: 'VTI51340',
    ruangan: 'Lab Hardware & IoT, Lantai 5',
    hari: 'Rabu',
    jamMulai: '15.00',
    jamSelesai: '17.30',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51340',
    dosenNip: '198709232014041001',
  },
  // Dari db_eduinsight Web (Kelas PFA3):
  {
    id: 'kelas-pfa',
    kodeGabung: 'PFA3',
    ruangan: 'Kelas A',
    hari: 'Senin',
    jamMulai: '10.20',
    jamSelesai: '13.00',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'PFA3',
    dosenNip: '198503152010121002', // Dr. Ahmad Sahroni, M.Kom.
  },
];

// 4. Data Master Tugas (Mobile + Web)
const MASTER_TUGAS = [
  {
    id: 'tugas-kwu-01',
    kelasId: 'kelas-kwu',
    judul: 'Tugas 1 - Quiziz',
    deskripsi: 'Kerjakan kuis Kewirausahaan melalui Quizizz materi BMC (Business Model Canvas).\n\n• Kerjakan tepat waktu sebelum tenggat\n• Screenshot nilai akhir kuis dan lampirkan sebagai bukti pengerjaan tugas.',
    lampiran: 'Panduan_Kuis_Kewirausahaan.pdf',
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000),
    deadlineText: 'Hari ini, 23.59',
    category: 'segera',
  },
  {
    id: 'tugas-uiux-01',
    kelasId: 'kelas-uiux',
    judul: 'Tugas 1 - Analisa Aplikasi',
    deskripsi: 'Lakukan analisa heuristik pada aplikasi mobile EduTech pilihanmu.\n\n• Identifikasi 5 masalah usability beserta rekomendasi perbaikannya\n• Kumpulkan dalam format PDF rangkuman laporan.',
    lampiran: 'Template_Analisa_Heuristik.pdf',
    deadline: new Date(Date.now() + 5 * 60 * 60 * 1000),
    deadlineText: 'Hari ini, 23.59',
    category: 'segera',
  },
  {
    id: 'tugas-iot-01',
    kelasId: 'kelas-iot',
    judul: 'Pertemuan Pertama',
    deskripsi: 'Buat rangkuman singkat mengenai komponen mikrokontroler ESP32 dan protokol MQTT.\n\n• Format: PDF (maksimal 2 halaman)\n• Unggah dokumen hasil resume pada bagian Tugas Saya di bawah.',
    lampiran: null,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    deadlineText: 'Rabu, 23.59',
    category: 'segera',
  },
  {
    id: 'tugas-ai-01',
    kelasId: 'kelas-ai',
    judul: 'Tugas Pengenalan AI',
    deskripsi: 'Rangkuman pengantar AI, perbedaan antara machine learning dan deep learning, serta implementasi agen cerdas.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Modul_Pengenalan_AI.pdf',
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deadlineText: 'Diserahkan',
    category: 'selesai',
  },
  {
    id: 'tugas-ai-02',
    kelasId: 'kelas-ai',
    judul: 'AI Klasik dan Modern',
    deskripsi: 'Studi kasus perbandingan algoritma pencarian BFS/DFS dan A* Search pada implementasi maze routing.',
    lampiran: null,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    deadlineText: 'Minggu depan',
    category: 'segera',
  },
  {
    id: 'tugas-basdat-01',
    kelasId: 'kelas-basdat',
    judul: 'Latihan SQL Dasar',
    deskripsi: 'Latihan query DDL & DML, join relasi tabel, dan agregasi data pada MySQL / PostgreSQL.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Soal_Latihan_SQL.pdf',
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    deadlineText: 'Diserahkan',
    category: 'selesai',
  },
  {
    id: 'tugas-web-01',
    kelasId: 'kelas-web',
    judul: 'Tugas Array & Function',
    deskripsi: 'Implementasi logika manipulasi array dan closure function pada JavaScript ES6+.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Panduan_Array_Function.pdf',
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    deadlineText: 'Diserahkan',
    category: 'selesai',
  },
  {
    id: 'tugas-iot-02',
    kelasId: 'kelas-iot',
    judul: 'Laporan Praktikum 1',
    deskripsi: 'Laporan hasil pembacaan sensor DHT22 ke serial monitor dan simulasi Wokwi.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Modul_Praktikum_IoT_1.pdf',
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    deadlineText: 'Diserahkan',
    category: 'selesai',
  },
  // Dari db_eduinsight Web:
  {
    id: 'tugas-pfa-01',
    kelasId: 'kelas-pfa',
    judul: 'Membuat API Express.js',
    deskripsi: 'Menyelesaikan modul MVC untuk backend EduInsight',
    lampiran: null,
    deadline: new Date('2026-06-15T23:59:00Z'),
    deadlineText: '15 Juni 2026',
    category: 'segera',
  },
];

// 5. Data Dummy Kehadiran (Mobile + Web)
const MASTER_KEHADIRAN = [
  // Basis Data
  { id: 'khd-bd-5', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data', studentName: 'Brooke Everly', nomor: 5, topik: 'Query & Relasi Tabel', tanggal: 'Rabu, 29 Oktober 2026', status: 'Sakit' },
  { id: 'khd-bd-4', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data', studentName: 'Brooke Everly', nomor: 4, topik: 'Dasar SQL', tanggal: 'Rabu, 22 Oktober 2026', status: 'Alpa' },
  { id: 'khd-bd-3', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data', studentName: 'Brooke Everly', nomor: 3, topik: 'Relasi Database', tanggal: 'Rabu, 15 Oktober 2026', status: 'Hadir' },
  { id: 'khd-bd-2', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data', studentName: 'Brooke Everly', nomor: 2, topik: 'Model Data & ERD', tanggal: 'Rabu, 8 Oktober 2026', status: 'Hadir' },
  { id: 'khd-bd-1', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengenalan Basis Data', tanggal: 'Rabu, 1 Oktober 2026', status: 'Hadir' },

  // Kecerdasan Buatan
  { id: 'khd-ai-4', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 4, topik: 'Pencarian Heuristik', tanggal: 'Senin, 19 Oktober 2026', status: 'Hadir' },
  { id: 'khd-ai-3', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 3, topik: 'Pencarian Buta', tanggal: 'Senin, 12 Oktober 2026', status: 'Izin' },
  { id: 'khd-ai-2', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 2, topik: 'Agen Cerdas', tanggal: 'Senin, 5 Oktober 2026', status: 'Hadir' },
  { id: 'khd-ai-1', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengenalan AI', tanggal: 'Senin, 28 September 2026', status: 'Hadir' },

  // Pemrograman Web
  { id: 'khd-web-3', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 3, topik: 'Routing & Navigasi', tanggal: 'Selasa, 13 Oktober 2026', status: 'Hadir' },
  { id: 'khd-web-2', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 2, topik: 'Komponen & Props', tanggal: 'Selasa, 6 Oktober 2026', status: 'Hadir' },
  { id: 'khd-web-1', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 1, topik: 'Dasar HTML & CSS', tanggal: 'Selasa, 29 September 2026', status: 'Alpa' },

  // Dari db_eduinsight Web (Sheren - Pemrograman Framework)
  { id: 'khd-pfa-1', kelasId: 'kelas-pfa', namaMatkul: 'Pemrograman Framework', studentName: 'Sheren', nomor: 1, topik: 'Pengenalan Express & MVC', tanggal: '2026-06-07', status: 'Hadir' },
];

// 6. Data Dummy Evaluasi AI & Dosen (Mobile + Web)
const MASTER_EVALUASI = [
  {
    id: 'eval-01',
    kelasId: 'kelas-ai',
    studentName: 'Brooke Everly',
    nilaiAkhir: 85.0,
    trenKehadiran: '88%',
    indikatorRisiko: 'Sedang',
    insightPerforma: 'Nilai tugas sangat konsisten, namun keaktifan kuis perlu ditingkatkan.',
    catatanDosen: 'Mohon temui saya di ruang dosen pada hari Rabu jam 10.00 untuk membahas remedial kuis dan perbaikan presensi sebelum UTS.',
    dateText: 'Senin, 24 Januari 2026',
    lecturerName: 'Dr. Ahmad Sahroni, M.Kom.',
    messages: JSON.stringify([
      {
        text: 'Kehadiranmu mengalami penurunan dalam beberapa pertemuan terakhir. Usahakan hadir pada pertemuan berikutnya agar tetap memenuhi batas minimum kehadiran.',
        isPositive: false,
      },
      {
        text: 'Nilai kuis terakhir masih rendah. Coba pelajari kembali materi yang berkaitan dan kerjakan latihan tambahan.',
        isPositive: false,
      },
    ]),
    lecturerNote: 'Mohon temui saya di ruang dosen pada hari Rabu jam 10.00 untuk membahas remedial kuis dan perbaikan presensi sebelum UTS.',
  },
  {
    id: 'eval-02',
    kelasId: 'kelas-web',
    studentName: 'Brooke Everly',
    nilaiAkhir: 90.0,
    trenKehadiran: '95%',
    indikatorRisiko: 'Rendah',
    insightPerforma: 'Performa sangat baik pada tugas routing dan komponen.',
    catatanDosen: 'Bagus, pertahankan!',
    dateText: 'Minggu, 23 Januari 2026',
    lecturerName: 'Ir. Tri Astuti, M.T.',
    messages: JSON.stringify([
      {
        text: 'Kehadiranmu mulai membaik dibanding minggu sebelumnya. Pertahankan konsistensi kehadiran.',
        isPositive: true,
      },
      {
        text: 'Nilai kuis terakhir meningkat. Pertahankan pola belajar dan fokus pada materi yang masih belum dikuasai.',
        isPositive: true,
      },
      {
        text: 'Materi yang perlu dipelajari kembali: array dan function.',
        isPositive: false,
      },
    ]),
    lecturerNote: null,
  },
  {
    id: 'eval-03',
    kelasId: 'kelas-cyber',
    studentName: 'Brooke Everly',
    nilaiAkhir: 82.5,
    trenKehadiran: '90%',
    indikatorRisiko: 'Rendah',
    insightPerforma: 'Hasil tugas lab keamanan baik.',
    catatanDosen: null,
    dateText: 'Sabtu, 22 Januari 2026',
    lecturerName: 'Prof. Bambang Hariyanto, Ph.D.',
    messages: JSON.stringify([
      {
        text: 'Kehadiran telah memenuhi batas minimum.',
        isPositive: true,
      },
      {
        text: 'Nilai tugas sudah cukup baik, tetapi hasil kuis masih belum konsisten. Perhatikan kembali materi yang mendapat nilai rendah.',
        isPositive: false,
      },
    ]),
    lecturerNote: null,
  },
  // Dari db_eduinsight Web (Sheren Annabelle):
  {
    id: 'eval-web-01',
    kelasId: 'kelas-pfa',
    studentName: 'Sheren Annabelle',
    nilaiAkhir: 88.5,
    trenKehadiran: '95%',
    indikatorRisiko: 'Rendah',
    insightPerforma: 'Menunjukkan pemahaman yang sangat baik pada modul praktikum backend dan konsisten mengumpulkan tugas tepat waktu.',
    catatanDosen: 'Pertahankan performa yang baik, tingkatkan keaktifan di kelas.',
    dateText: 'Senin, 08 November 2026',
    lecturerName: 'Dr. Ahmad Sahroni, M.Kom.',
    messages: JSON.stringify([
      {
        text: 'Menunjukkan pemahaman yang sangat baik pada modul praktikum backend dan konsisten mengumpulkan tugas tepat waktu.',
        isPositive: true,
      },
    ]),
    lecturerNote: 'Pertahankan performa yang baik, tingkatkan keaktifan di kelas.',
  },
];

// 7. Data Master Penilaian (Dari db_eduinsight Web + Mobile)
const MASTER_PENILAIAN = [
  {
    id: 'penilaian-01',
    kelasId: 'kelas-pfa',
    studentName: 'Sheren',
    taskName: 'Pemrograman Framework - Tugas 1',
    score: 90,
  },
  {
    id: 'penilaian-02',
    kelasId: 'kelas-ai',
    studentName: 'Brooke Everly',
    taskName: 'Tugas Pengenalan AI',
    score: 95,
  },
  {
    id: 'penilaian-03',
    kelasId: 'kelas-web',
    studentName: 'Brooke Everly',
    taskName: 'Tugas Array & Function',
    score: 92,
  },
];

// 8. Data Password Settings Dosen (Dari db_eduinsight Web)
const MASTER_PASSWORD_SETTING = [
  {
    id: 1,
    dosenId: 'user-dsn-001',
    passwordHash: '$2a$10$zDfpzNBVoEDZf9IFfT5lYO5ixqxZiEpnzIs4aDUkrfS7BGTP4wlOC',
    notifikasiEmail: true,
    notifikasiSistem: true,
  },
];

function formatUser(u) {
  if (!u) return null;

  let alternativeEmails = [];
  if (u.alternativeEmails) {
    try {
      alternativeEmails = JSON.parse(u.alternativeEmails);
    } catch (_) {
      alternativeEmails = [u.alternativeEmails];
    }
  }

  let mataKuliah = [];
  if (u.mataKuliah) {
    try {
      mataKuliah = JSON.parse(u.mataKuliah);
    } catch (_) {
      mataKuliah = [u.mataKuliah];
    }
  }

  return {
    ...u,
    alternativeEmails,
    mataKuliah: u.role === 'dosen' ? mataKuliah : undefined,
  };
}

/**
 * Reset dan sync database MySQL eduinsight_db dengan data master (Mobile + Web)
 */
async function syncDatabaseWithFrontend() {
  try {
    // 1. Sync Users
    for (const u of DEFAULT_USERS) {
      await prisma.user.upsert({
        where: { email: u.email.toLowerCase().trim() },
        update: {
          name: u.name,
          alternativeEmails: u.alternativeEmails ? JSON.stringify(u.alternativeEmails) : null,
          role: u.role,
          nim: u.nim || null,
          nip: u.nip || null,
          angkatan: u.angkatan || '2023',
          fakultas: u.fakultas || 'Ilmu Komputer',
          prodi: u.prodi || 'Teknik Informatika',
          mataKuliah: u.mataKuliah ? JSON.stringify(u.mataKuliah) : null,
        },
        create: {
          id: u.id,
          name: u.name,
          email: u.email.toLowerCase().trim(),
          alternativeEmails: u.alternativeEmails ? JSON.stringify(u.alternativeEmails) : null,
          password: u.password,
          role: u.role || 'mahasiswa',
          nim: u.nim || null,
          nip: u.nip || null,
          angkatan: u.angkatan || '2023',
          fakultas: u.fakultas || 'Ilmu Komputer',
          prodi: u.prodi || 'Teknik Informatika',
          mataKuliah: u.mataKuliah ? JSON.stringify(u.mataKuliah) : null,
          createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        },
      });
    }

    // 2. Sync Mata Kuliah
    for (const mk of MASTER_MATKUL) {
      await prisma.mataKuliah.upsert({
        where: { kode: mk.kode },
        update: {
          nama: mk.nama,
          sks: mk.sks,
        },
        create: {
          id: mk.id,
          kode: mk.kode,
          nama: mk.nama,
          sks: mk.sks,
        },
      });
    }

    // 3. Sync Kelas
    for (const k of MASTER_KELAS) {
      const matkul = await prisma.mataKuliah.findUnique({ where: { kode: k.matkulKode } });
      const dosen = await prisma.user.findFirst({ where: { nip: k.dosenNip } });

      if (matkul && dosen) {
        await prisma.kelas.upsert({
          where: { kodeGabung: k.kodeGabung },
          update: {
            ruangan: k.ruangan,
            hari: k.hari,
            jamMulai: k.jamMulai,
            jamSelesai: k.jamSelesai,
            semester: k.semester,
            tahunAjaran: k.tahunAjaran,
            status: k.status,
            mataKuliahId: matkul.id,
            dosenId: dosen.id,
          },
          create: {
            id: k.id,
            kodeGabung: k.kodeGabung,
            ruangan: k.ruangan,
            hari: k.hari,
            jamMulai: k.jamMulai,
            jamSelesai: k.jamSelesai,
            semester: k.semester,
            tahunAjaran: k.tahunAjaran,
            status: k.status,
            mataKuliahId: matkul.id,
            dosenId: dosen.id,
          },
        });
      }
    }

    // 4. Sync Tugas
    for (const t of MASTER_TUGAS) {
      await prisma.tugas.upsert({
        where: { id: t.id },
        update: {
          judul: t.judul,
          deskripsi: t.deskripsi,
          deadline: t.deadline,
          deadlineText: t.deadlineText,
          category: t.category,
          lampiran: t.lampiran,
          kelasId: t.kelasId,
        },
        create: {
          id: t.id,
          judul: t.judul,
          deskripsi: t.deskripsi,
          deadline: t.deadline,
          deadlineText: t.deadlineText,
          category: t.category,
          lampiran: t.lampiran,
          kelasId: t.kelasId,
        },
      });
    }

    // 5. Sync Kehadiran
    for (const kh of MASTER_KEHADIRAN) {
      await prisma.kehadiran.upsert({
        where: { id: kh.id },
        update: {
          namaMatkul: kh.namaMatkul,
          studentName: kh.studentName,
          nomor: kh.nomor,
          topik: kh.topik,
          tanggal: kh.tanggal,
          status: kh.status,
          kelasId: kh.kelasId,
        },
        create: {
          id: kh.id,
          namaMatkul: kh.namaMatkul,
          studentName: kh.studentName,
          nomor: kh.nomor,
          topik: kh.topik,
          tanggal: kh.tanggal,
          status: kh.status,
          kelasId: kh.kelasId,
        },
      });
    }

    // 6. Sync Evaluasi
    for (const ev of MASTER_EVALUASI) {
      await prisma.evaluasi.upsert({
        where: { id: ev.id },
        update: {
          kelasId: ev.kelasId,
          studentName: ev.studentName,
          nilaiAkhir: ev.nilaiAkhir,
          trenKehadiran: ev.trenKehadiran,
          indikatorRisiko: ev.indikatorRisiko,
          insightPerforma: ev.insightPerforma,
          catatanDosen: ev.catatanDosen,
          dateText: ev.dateText,
          lecturerName: ev.lecturerName,
          messages: ev.messages,
          lecturerNote: ev.lecturerNote,
        },
        create: {
          id: ev.id,
          kelasId: ev.kelasId,
          studentName: ev.studentName,
          nilaiAkhir: ev.nilaiAkhir,
          trenKehadiran: ev.trenKehadiran,
          indikatorRisiko: ev.indikatorRisiko,
          insightPerforma: ev.insightPerforma,
          catatanDosen: ev.catatanDosen,
          dateText: ev.dateText,
          lecturerName: ev.lecturerName,
          messages: ev.messages,
          lecturerNote: ev.lecturerNote,
        },
      });
    }

    // 7. Sync Penilaian
    for (const p of MASTER_PENILAIAN) {
      await prisma.penilaian.upsert({
        where: { id: p.id },
        update: {
          kelasId: p.kelasId,
          studentName: p.studentName,
          taskName: p.taskName,
          score: p.score,
        },
        create: {
          id: p.id,
          kelasId: p.kelasId,
          studentName: p.studentName,
          taskName: p.taskName,
          score: p.score,
        },
      });
    }

    // 8. Sync Password Settings Dosen
    for (const ps of MASTER_PASSWORD_SETTING) {
      await prisma.passwordSetting.upsert({
        where: { id: ps.id },
        update: {
          dosenId: ps.dosenId,
          passwordHash: ps.passwordHash,
          notifikasiEmail: ps.notifikasiEmail,
          notifikasiSistem: ps.notifikasiSistem,
        },
        create: {
          id: ps.id,
          dosenId: ps.dosenId,
          passwordHash: ps.passwordHash,
          notifikasiEmail: ps.notifikasiEmail,
          notifikasiSistem: ps.notifikasiSistem,
        },
      });
    }

    console.log('✅ Sinkronisasi Database MySQL EduInsight (Mobile + Web) Berhasil!');
  } catch (err) {
    console.error('❌ Database sync error:', err.message);
  }
}

async function initDatabase() {
  await syncDatabaseWithFrontend();
}

async function findUserByEmail(email) {
  if (!email) return null;
  const target = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: target,
      },
    },
  });

  if (user) {
    return formatUser(user);
  }

  const allUsers = await prisma.user.findMany();
  for (const u of allUsers) {
    if (u.alternativeEmails) {
      try {
        const altList = JSON.parse(u.alternativeEmails);
        if (Array.isArray(altList) && altList.some((e) => e.toLowerCase() === target)) {
          return formatUser(u);
        }
      } catch (e) {
        if (u.alternativeEmails.toLowerCase().includes(target)) {
          return formatUser(u);
        }
      }
    }
  }

  return null;
}

async function findUserById(id) {
  if (!id) return null;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return formatUser(user);
}

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'asc' },
  });
  return users.map(formatUser);
}

async function createUser(userData) {
  const created = await prisma.user.create({
    data: {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase().trim(),
      alternativeEmails: userData.alternativeEmails ? JSON.stringify(userData.alternativeEmails) : null,
      password: userData.password,
      role: userData.role || 'mahasiswa',
      nim: userData.nim || null,
      nip: userData.nip || null,
      angkatan: userData.angkatan || '2023',
      fakultas: userData.fakultas || 'Ilmu Komputer',
      prodi: userData.prodi || 'Teknik Informatika',
      mataKuliah: userData.mataKuliah ? JSON.stringify(userData.mataKuliah) : null,
    },
  });
  return formatUser(created);
}

async function updateUser(id, updateData) {
  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  return formatUser(updated);
}

async function deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}

async function updateUserPassword(email, newHashedPassword) {
  const user = await findUserByEmail(email);
  if (!user) return null;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      password: newHashedPassword,
      updatedAt: new Date(),
    },
  });

  return formatUser(updated);
}

async function blacklistToken(token) {
  try {
    await prisma.tokenBlacklist.create({
      data: { token },
    });
  } catch (err) {}
}

async function isTokenBlacklisted(token) {
  if (!token) return false;
  const found = await prisma.tokenBlacklist.findUnique({
    where: { token },
  });
  return !!found;
}

// Catatan (Notes)
async function getUserNotes(userId) {
  return await prisma.note.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
  });
}

async function createNote(userId, title, body) {
  return await prisma.note.create({
    data: {
      userId,
      title,
      body,
      synced: true,
      updatedAt: BigInt(Date.now()),
    },
  });
}

module.exports = {
  prisma,
  initDatabase,
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  blacklistToken,
  isTokenBlacklisted,
  getUserNotes,
  createNote,
  DEFAULT_USERS,
  MASTER_MATKUL,
  MASTER_KELAS,
  MASTER_TUGAS,
  MASTER_KEHADIRAN,
  MASTER_EVALUASI,
  MASTER_PENILAIAN,
  MASTER_PASSWORD_SETTING,
};
