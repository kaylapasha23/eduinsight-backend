import * as bcrypt from 'bcryptjs';
import { PrismaClient, User as PrismaUser } from '@prisma/client';

const prisma = new PrismaClient();

// --- INTERFACES & TYPES ---

export interface UserSeedData {
  id: string;
  name: string;
  email: string;
  alternativeEmails?: string[] | string;
  password: string;
  role: string;
  nim?: string;
  nip?: string;
  angkatan?: string;
  semester?: number;
  fakultas?: string;
  prodi?: string;
  mataKuliah?: string[] | string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface MasterMatkul {
  id: string;
  kode: string;
  nama: string;
  sks: number;
}

export interface MasterKelas {
  id: string;
  kodeGabung: string;
  ruangan: string;
  hari: string;
  jamMulai: string;
  jamSelesai: string;
  semester: number;
  tahunAjaran: string;
  status: string;
  matkulKode: string;
  dosenNip: string;
}

export interface MasterTugas {
  id: string;
  kelasId: string;
  judul: string;
  deskripsi: string;
  lampiran: string | null;
  deadline: Date;
  deadlineText: string;
  category: string;
}

export interface MasterKehadiran {
  id: string;
  kelasId: string;
  namaMatkul: string;
  studentName: string;
  nomor: number;
  topik: string;
  tanggal: string;
  status: string;
}

export interface MasterEvaluasi {
  id: string;
  kelasId: string;
  studentName: string;
  nilaiAkhir: number;
  trenKehadiran: string;
  indikatorRisiko: string;
  insightPerforma: string;
  catatanDosen: string | null;
  dateText: string;
  lecturerName: string;
  messages: string;
  lecturerNote: string | null;
}

export interface MasterPenilaian {
  id: string;
  kelasId: string;
  studentName: string;
  taskName: string;
  score: number;
}

export interface MasterPasswordSetting {
  id: number;
  dosenId: string;
  passwordHash: string;
  notifikasiEmail: boolean;
  notifikasiSistem: boolean;
}

export interface MataKuliahNilai {
  nomor: number;
  nama: string;
  kode: string;
  sks: number;
  grade: string;
}

export interface MasterNilaiSemester {
  judul: string;
  tahunAjaran: string;
  ips: number;
  totalSks: number;
  matkul: MataKuliahNilai[];
}

// --- 1. DATA USERS DUMMY ---
const DEFAULT_USERS: UserSeedData[] = [
  {
    id: 'user-mhs-brooke',
    name: 'Brooke Everly',
    email: 'brookeverly17@eduinsight.student.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '254076512225017',
    angkatan: '2026',
    semester: 1,
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-24T16:18:50.615Z',
  },
  {
    id: 'user-mhs-chris',
    name: 'Chris Redfield',
    email: 'redchris@eduinsight.student.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '254076512225018',
    angkatan: '2026',
    semester: 1,
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-25T00:51:53.109Z',
  },
  {
    id: 'user-mhs-sheren',
    name: 'Sheren Annabelle',
    email: 'sheren@eduinsight.student.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '220101001',
    angkatan: '2026',
    semester: 1,
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-14T15:28:13.659Z',
  },
  {
    id: 'user-mhs-nareswari',
    name: 'Nareswari Ayu',
    email: 'nareswari@eduinsight.student.ac.id',
    password: bcrypt.hashSync('password123', 10),
    role: 'mahasiswa',
    nim: '220101004',
    angkatan: '2026',
    semester: 1,
    fakultas: 'Ilmu Komputer',
    prodi: 'Teknik Informatika',
    createdAt: '2026-10-26T08:00:00.000Z',
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
    mataKuliah: [
      'Kecerdasan Buatan',
      'Pemrograman Web',
      'Basis Data Terdistribusi',
      'Keamanan Siber & Jaringan',
      'Rekayasa Perangkat Lunak',
      'Statistika Komputasi',
      'Kewirausahaan',
      'UI/UX Design',
      'Internet of Things (IoT)',
      'Pemrograman Framework'
    ],
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

// --- 2. DATA MASTER MATA KULIAH ---
const MASTER_MATKUL: MasterMatkul[] = [
  { id: 'mk-ai', kode: 'VTI51366', nama: 'Kecerdasan Buatan', sks: 3 },
  { id: 'mk-web', kode: 'VTI51329', nama: 'Pemrograman Web', sks: 4 },
  { id: 'mk-basdat', kode: 'VTI51250', nama: 'Basis Data Terdistribusi', sks: 4 },
  { id: 'mk-cyber', kode: 'VTI51322', nama: 'Keamanan Siber & Jaringan', sks: 4 },
  { id: 'mk-rpl', kode: 'VTI51375', nama: 'Rekayasa Perangkat Lunak', sks: 4 },
  { id: 'mk-stat', kode: 'VTI51389', nama: 'Statistika Komputasi', sks: 3 },
  { id: 'mk-kwu', kode: 'VTI51310', nama: 'Kewirausahaan', sks: 2 },
  { id: 'mk-uiux', kode: 'VTI51315', nama: 'UI/UX Design', sks: 3 },
  { id: 'mk-iot', kode: 'VTI51340', nama: 'Internet of Things (IoT)', sks: 3 },
  { id: 'mk-pfa', kode: 'PFA3', nama: 'Pemrograman Framework', sks: 3 },
];

// --- 3. DATA MASTER KELAS ---
const MASTER_KELAS: MasterKelas[] = [
  {
    id: 'kelas-ai',
    kodeGabung: 'VTI51366',
    ruangan: 'Lantai 7, Ruangan 701',
    hari: 'Senin',
    jamMulai: '14.00',
    jamSelesai: '15.20',
    semester: 1,
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
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51329',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-basdat',
    kodeGabung: 'VTI51250',
    ruangan: 'Lantai 6, Ruang 606',
    hari: 'Rabu',
    jamMulai: '12.00',
    jamSelesai: '14.00',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51250',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-cyber',
    kodeGabung: 'VTI51322',
    ruangan: 'Lab Keamanan, Lantai 4',
    hari: 'Kamis',
    jamMulai: '10.00',
    jamSelesai: '12.00',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51322',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-rpl',
    kodeGabung: 'VTI51375',
    ruangan: 'Lantai 3, Ruang 304',
    hari: 'Jumat',
    jamMulai: '08.00',
    jamSelesai: '10.30',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51375',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-stat',
    kodeGabung: 'VTI51389',
    ruangan: 'Lantai 2, Ruang 201',
    hari: 'Jumat',
    jamMulai: '13.30',
    jamSelesai: '15.00',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51389',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-kwu',
    kodeGabung: 'VTI51310',
    ruangan: 'Lantai 4, Ruang 401',
    hari: 'Senin',
    jamMulai: '08.00',
    jamSelesai: '09.40',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51310',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-uiux',
    kodeGabung: 'VTI51315',
    ruangan: 'Lab Multimedia, Lantai 3',
    hari: 'Selasa',
    jamMulai: '13.00',
    jamSelesai: '15.30',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51315',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-iot',
    kodeGabung: 'VTI51340',
    ruangan: 'Lab Hardware & IoT, Lantai 5',
    hari: 'Rabu',
    jamMulai: '15.00',
    jamSelesai: '17.30',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51340',
    dosenNip: '198503152010121002',
  },
  {
    id: 'kelas-pfa',
    kodeGabung: 'PFA3',
    ruangan: 'Kelas A',
    hari: 'Senin',
    jamMulai: '10.20',
    jamSelesai: '13.00',
    semester: 1,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'PFA3',
    dosenNip: '198503152010121002',
  },
];

// --- 4. DATA MASTER TUGAS ---
const MASTER_TUGAS: MasterTugas[] = [
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

// --- 5. DATA KEHADIRAN MAHASISWA ---
const MASTER_KEHADIRAN: MasterKehadiran[] = [
  { id: 'khd-ai-1', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengenalan AI & Sejarah', tanggal: 'Senin, 28 Sep 2026', status: 'Hadir' },
  { id: 'khd-ai-2', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 2, topik: 'Agen Cerdas & Lingkungan', tanggal: 'Senin, 5 Okt 2026', status: 'Hadir' },
  { id: 'khd-ai-3', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 3, topik: 'Pencarian Buta (BFS/DFS)', tanggal: 'Senin, 12 Okt 2026', status: 'Izin' },
  { id: 'khd-ai-4', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 4, topik: 'Pencarian Heuristik & A*', tanggal: 'Senin, 19 Okt 2026', status: 'Hadir' },
  { id: 'khd-ai-5', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 5, topik: 'Logika Proposisi', tanggal: 'Senin, 26 Okt 2026', status: 'Hadir' },
  { id: 'khd-ai-6', kelasId: 'kelas-ai', namaMatkul: 'Kecerdasan Buatan', studentName: 'Brooke Everly', nomor: 6, topik: 'Machine Learning Dasar', tanggal: 'Senin, 2 Nov 2026', status: 'Hadir' },

  { id: 'khd-web-1', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 1, topik: 'Dasar HTML & CSS', tanggal: 'Selasa, 29 Sep 2026', status: 'Alpa' },
  { id: 'khd-web-2', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 2, topik: 'JavaScript ES6+ & DOM', tanggal: 'Selasa, 6 Okt 2026', status: 'Hadir' },
  { id: 'khd-web-3', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 3, topik: 'React: Komponen & Props', tanggal: 'Selasa, 13 Okt 2026', status: 'Hadir' },
  { id: 'khd-web-4', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 4, topik: 'React: Routing & State', tanggal: 'Selasa, 20 Okt 2026', status: 'Hadir' },
  { id: 'khd-web-5', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 5, topik: 'REST API & Fetch', tanggal: 'Selasa, 27 Okt 2026', status: 'Hadir' },
  { id: 'khd-web-6', kelasId: 'kelas-web', namaMatkul: 'Pemrograman Web', studentName: 'Brooke Everly', nomor: 6, topik: 'Deployment & Build', tanggal: 'Selasa, 3 Nov 2026', status: 'Sakit' },

  { id: 'khd-bd-1', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data Terdistribusi', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengenalan Basis Data', tanggal: 'Rabu, 1 Okt 2026', status: 'Hadir' },
  { id: 'khd-bd-2', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data Terdistribusi', studentName: 'Brooke Everly', nomor: 2, topik: 'Model Data & ERD', tanggal: 'Rabu, 8 Okt 2026', status: 'Hadir' },
  { id: 'khd-bd-3', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data Terdistribusi', studentName: 'Brooke Everly', nomor: 3, topik: 'Normalisasi & Relasi', tanggal: 'Rabu, 15 Okt 2026', status: 'Hadir' },
  { id: 'khd-bd-4', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data Terdistribusi', studentName: 'Brooke Everly', nomor: 4, topik: 'Dasar SQL & Query', tanggal: 'Rabu, 22 Okt 2026', status: 'Alpa' },
  { id: 'khd-bd-5', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data Terdistribusi', studentName: 'Brooke Everly', nomor: 5, topik: 'Join & Agregasi Tabel', tanggal: 'Rabu, 29 Okt 2026', status: 'Sakit' },
  { id: 'khd-bd-6', kelasId: 'kelas-basdat', namaMatkul: 'Basis Data Terdistribusi', studentName: 'Brooke Everly', nomor: 6, topik: 'Replikasi & Sharding', tanggal: 'Rabu, 5 Nov 2026', status: 'Hadir' },

  { id: 'khd-cyber-1', kelasId: 'kelas-cyber', namaMatkul: 'Keamanan Siber & Jaringan', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengantar Keamanan Siber', tanggal: 'Kamis, 2 Okt 2026', status: 'Hadir' },
  { id: 'khd-cyber-2', kelasId: 'kelas-cyber', namaMatkul: 'Keamanan Siber & Jaringan', studentName: 'Brooke Everly', nomor: 2, topik: 'Kriptografi Simetris', tanggal: 'Kamis, 9 Okt 2026', status: 'Hadir' },
  { id: 'khd-cyber-3', kelasId: 'kelas-cyber', namaMatkul: 'Keamanan Siber & Jaringan', studentName: 'Brooke Everly', nomor: 3, topik: 'Kriptografi Asimetris', tanggal: 'Kamis, 16 Okt 2026', status: 'Hadir' },
  { id: 'khd-cyber-4', kelasId: 'kelas-cyber', namaMatkul: 'Keamanan Siber & Jaringan', studentName: 'Brooke Everly', nomor: 4, topik: 'Kerentanan Jaringan', tanggal: 'Kamis, 23 Okt 2026', status: 'Izin' },
  { id: 'khd-cyber-5', kelasId: 'kelas-cyber', namaMatkul: 'Keamanan Siber & Jaringan', studentName: 'Brooke Everly', nomor: 5, topik: 'Firewall & IDS', tanggal: 'Kamis, 30 Okt 2026', status: 'Hadir' },
  { id: 'khd-cyber-6', kelasId: 'kelas-cyber', namaMatkul: 'Keamanan Siber & Jaringan', studentName: 'Brooke Everly', nomor: 6, topik: 'Penetration Testing', tanggal: 'Kamis, 6 Nov 2026', status: 'Hadir' },

  { id: 'khd-rpl-1', kelasId: 'kelas-rpl', namaMatkul: 'Rekayasa Perangkat Lunak', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengantar RPL & SDLC', tanggal: 'Jumat, 3 Okt 2026', status: 'Hadir' },
  { id: 'khd-rpl-2', kelasId: 'kelas-rpl', namaMatkul: 'Rekayasa Perangkat Lunak', studentName: 'Brooke Everly', nomor: 2, topik: 'Analisis Kebutuhan', tanggal: 'Jumat, 10 Okt 2026', status: 'Hadir' },
  { id: 'khd-rpl-3', kelasId: 'kelas-rpl', namaMatkul: 'Rekayasa Perangkat Lunak', studentName: 'Brooke Everly', nomor: 3, topik: 'UML & Use Case Diagram', tanggal: 'Jumat, 17 Okt 2026', status: 'Hadir' },
  { id: 'khd-rpl-4', kelasId: 'kelas-rpl', namaMatkul: 'Rekayasa Perangkat Lunak', studentName: 'Brooke Everly', nomor: 4, topik: 'Desain Arsitektur', tanggal: 'Jumat, 24 Okt 2026', status: 'Hadir' },
  { id: 'khd-rpl-5', kelasId: 'kelas-rpl', namaMatkul: 'Rekayasa Perangkat Lunak', studentName: 'Brooke Everly', nomor: 5, topik: 'Testing & Validasi', tanggal: 'Jumat, 31 Okt 2026', status: 'Sakit' },
  { id: 'khd-rpl-6', kelasId: 'kelas-rpl', namaMatkul: 'Rekayasa Perangkat Lunak', studentName: 'Brooke Everly', nomor: 6, topik: 'Agile & Scrum', tanggal: 'Jumat, 7 Nov 2026', status: 'Hadir' },

  { id: 'khd-stat-1', kelasId: 'kelas-stat', namaMatkul: 'Statistika Komputasi', studentName: 'Brooke Everly', nomor: 1, topik: 'Statistika Deskriptif', tanggal: 'Jumat, 3 Okt 2026', status: 'Hadir' },
  { id: 'khd-stat-2', kelasId: 'kelas-stat', namaMatkul: 'Statistika Komputasi', studentName: 'Brooke Everly', nomor: 2, topik: 'Distribusi Probabilitas', tanggal: 'Jumat, 10 Okt 2026', status: 'Hadir' },
  { id: 'khd-stat-3', kelasId: 'kelas-stat', namaMatkul: 'Statistika Komputasi', studentName: 'Brooke Everly', nomor: 3, topik: 'Uji Hipotesis', tanggal: 'Jumat, 17 Okt 2026', status: 'Izin' },
  { id: 'khd-stat-4', kelasId: 'kelas-stat', namaMatkul: 'Statistika Komputasi', studentName: 'Brooke Everly', nomor: 4, topik: 'Regresi Linier', tanggal: 'Jumat, 24 Okt 2026', status: 'Hadir' },
  { id: 'khd-stat-5', kelasId: 'kelas-stat', namaMatkul: 'Statistika Komputasi', studentName: 'Brooke Everly', nomor: 5, topik: 'ANOVA & Korelasi', tanggal: 'Jumat, 31 Okt 2026', status: 'Hadir' },
  { id: 'khd-stat-6', kelasId: 'kelas-stat', namaMatkul: 'Statistika Komputasi', studentName: 'Brooke Everly', nomor: 6, topik: 'Analisis Cluster', tanggal: 'Jumat, 7 Nov 2026', status: 'Hadir' },

  { id: 'khd-kwu-1', kelasId: 'kelas-kwu', namaMatkul: 'Kewirausahaan', studentName: 'Brooke Everly', nomor: 1, topik: 'Konsep Dasar Kewirausahaan', tanggal: 'Senin, 29 Sep 2026', status: 'Hadir' },
  { id: 'khd-kwu-2', kelasId: 'kelas-kwu', namaMatkul: 'Kewirausahaan', studentName: 'Brooke Everly', nomor: 2, topik: 'Business Model Canvas', tanggal: 'Senin, 6 Okt 2026', status: 'Hadir' },
  { id: 'khd-kwu-3', kelasId: 'kelas-kwu', namaMatkul: 'Kewirausahaan', studentName: 'Brooke Everly', nomor: 3, topik: 'Analisis Pasar & Kompetitor', tanggal: 'Senin, 13 Okt 2026', status: 'Hadir' },
  { id: 'khd-kwu-4', kelasId: 'kelas-kwu', namaMatkul: 'Kewirausahaan', studentName: 'Brooke Everly', nomor: 4, topik: 'Perencanaan Keuangan', tanggal: 'Senin, 20 Okt 2026', status: 'Hadir' },
  { id: 'khd-kwu-5', kelasId: 'kelas-kwu', namaMatkul: 'Kewirausahaan', studentName: 'Brooke Everly', nomor: 5, topik: 'Pitching & Presentasi', tanggal: 'Senin, 27 Okt 2026', status: 'Hadir' },
  { id: 'khd-kwu-6', kelasId: 'kelas-kwu', namaMatkul: 'Kewirausahaan', studentName: 'Brooke Everly', nomor: 6, topik: 'Studi Kasus Startup', tanggal: 'Senin, 3 Nov 2026', status: 'Izin' },

  { id: 'khd-uiux-1', kelasId: 'kelas-uiux', namaMatkul: 'UI/UX Design', studentName: 'Brooke Everly', nomor: 1, topik: 'Prinsip Desain UI', tanggal: 'Selasa, 30 Sep 2026', status: 'Hadir' },
  { id: 'khd-uiux-2', kelasId: 'kelas-uiux', namaMatkul: 'UI/UX Design', studentName: 'Brooke Everly', nomor: 2, topik: 'User Research & Persona', tanggal: 'Selasa, 7 Okt 2026', status: 'Hadir' },
  { id: 'khd-uiux-3', kelasId: 'kelas-uiux', namaMatkul: 'UI/UX Design', studentName: 'Brooke Everly', nomor: 3, topik: 'Wireframing & Prototyping', tanggal: 'Selasa, 14 Okt 2026', status: 'Hadir' },
  { id: 'khd-uiux-4', kelasId: 'kelas-uiux', namaMatkul: 'UI/UX Design', studentName: 'Brooke Everly', nomor: 4, topik: 'Heuristic Evaluation', tanggal: 'Selasa, 21 Okt 2026', status: 'Hadir' },
  { id: 'khd-uiux-5', kelasId: 'kelas-uiux', namaMatkul: 'UI/UX Design', studentName: 'Brooke Everly', nomor: 5, topik: 'Desain Figma High-Fi', tanggal: 'Selasa, 28 Okt 2026', status: 'Alpa' },
  { id: 'khd-uiux-6', kelasId: 'kelas-uiux', namaMatkul: 'UI/UX Design', studentName: 'Brooke Everly', nomor: 6, topik: 'Usability Testing', tanggal: 'Selasa, 4 Nov 2026', status: 'Hadir' },

  { id: 'khd-iot-1', kelasId: 'kelas-iot', namaMatkul: 'Internet of Things (IoT)', studentName: 'Brooke Everly', nomor: 1, topik: 'Pengenalan IoT & Arsitektur', tanggal: 'Rabu, 1 Okt 2026', status: 'Hadir' },
  { id: 'khd-iot-2', kelasId: 'kelas-iot', namaMatkul: 'Internet of Things (IoT)', studentName: 'Brooke Everly', nomor: 2, topik: 'Mikrokontroler ESP32', tanggal: 'Rabu, 8 Okt 2026', status: 'Hadir' },
  { id: 'khd-iot-3', kelasId: 'kelas-iot', namaMatkul: 'Internet of Things (IoT)', studentName: 'Brooke Everly', nomor: 3, topik: 'Sensor DHT22 & Aktuator', tanggal: 'Rabu, 15 Okt 2026', status: 'Hadir' },
  { id: 'khd-iot-4', kelasId: 'kelas-iot', namaMatkul: 'Internet of Things (IoT)', studentName: 'Brooke Everly', nomor: 4, topik: 'Protokol MQTT', tanggal: 'Rabu, 22 Okt 2026', status: 'Hadir' },
  { id: 'khd-iot-5', kelasId: 'kelas-iot', namaMatkul: 'Internet of Things (IoT)', studentName: 'Brooke Everly', nomor: 5, topik: 'Konektivitas WiFi & Cloud', tanggal: 'Rabu, 29 Okt 2026', status: 'Hadir' },
  { id: 'khd-iot-6', kelasId: 'kelas-iot', namaMatkul: 'Internet of Things (IoT)', studentName: 'Brooke Everly', nomor: 6, topik: 'Dashboard Monitoring IoT', tanggal: 'Rabu, 5 Nov 2026', status: 'Izin' },

  { id: 'khd-pfa-1', kelasId: 'kelas-pfa', namaMatkul: 'Pemrograman Framework', studentName: 'Sheren Annabelle', nomor: 1, topik: 'Pengenalan Express & MVC', tanggal: '2026-06-07', status: 'Hadir' },
];

// --- 6. DATA DUMMY EVALUASI AI & DOSEN ---
const MASTER_EVALUASI: MasterEvaluasi[] = [
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
    lecturerName: 'Dr. Ahmad Sahroni, M.Kom.',
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
    lecturerName: 'Dr. Ahmad Sahroni, M.Kom.',
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
  {
    id: 'eval-nareswari-01',
    kelasId: 'kelas-web',
    studentName: 'Nareswari Ayu',
    nilaiAkhir: 88.0,
    trenKehadiran: '92%',
    indikatorRisiko: 'Rendah',
    insightPerforma: 'Aktif dalam sesi praktikum frontend dan pengerjaan tugas sangat terstruktur.',
    catatanDosen: 'Sangat baik, terus kembangkan pemahaman React dan arsitektur komponen.',
    dateText: 'Selasa, 10 November 2026',
    lecturerName: 'Dr. Ahmad Sahroni, M.Kom.',
    messages: JSON.stringify([
      { text: 'Pemahaman materi layouting dan komponen React sangat baik.', isPositive: true },
      { text: 'Kehadiran konsisten dan selalu tepat waktu mengumpulkan tugas.', isPositive: true },
    ]),
    lecturerNote: 'Sangat baik, terus kembangkan pemahaman React dan arsitektur komponen.',
  },
  {
    id: 'eval-chris-01',
    kelasId: 'kelas-ai',
    studentName: 'Chris Redfield',
    nilaiAkhir: 84.0,
    trenKehadiran: '86%',
    indikatorRisiko: 'Rendah',
    insightPerforma: 'Pemahaman konsep dasar pencarian dan logika AI baik. Perlu memperhatikan ketepatan waktu pengumpulan tugas.',
    catatanDosen: 'Pertahankan kemajuan belajarnya, jangan terlambat mengumpulkan laporan.',
    dateText: 'Senin, 09 November 2026',
    lecturerName: 'Dr. Ahmad Sahroni, M.Kom.',
    messages: JSON.stringify([
      { text: 'Hasil pemahaman teori AI memuaskan.', isPositive: true },
      { text: 'Tugas terakhir diserahkan mendekati batas tenggat.', isPositive: false },
    ]),
    lecturerNote: 'Pertahankan kemajuan belajarnya, jangan terlambat mengumpulkan laporan.',
  },
];

// --- 7. DATA MASTER PENILAIAN ---
const MASTER_PENILAIAN: MasterPenilaian[] = [
  {
    id: 'penilaian-01',
    kelasId: 'kelas-pfa',
    studentName: 'Sheren Annabelle',
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
  {
    id: 'penilaian-04',
    kelasId: 'kelas-web',
    studentName: 'Nareswari Ayu',
    taskName: 'Tugas Array & Function',
    score: 90,
  },
  {
    id: 'penilaian-05',
    kelasId: 'kelas-ai',
    studentName: 'Chris Redfield',
    taskName: 'Tugas Pengenalan AI',
    score: 85,
  },
];

// --- 8. DATA PASSWORD SETTING DOSEN ---
const MASTER_PASSWORD_SETTING: MasterPasswordSetting[] = [
  {
    id: 1,
    dosenId: 'user-dsn-001',
    passwordHash: '$2a$10$zDfpzNBVoEDZf9IFfT5lYO5ixqxZiEpnzIs4aDUkrfS7BGTP4wlOC',
    notifikasiEmail: true,
    notifikasiSistem: true,
  },
];

// --- 9. DATA NILAI SEMESTER (1-4) ---
const MASTER_NILAI_SEMESTER: MasterNilaiSemester[] = [
  {
    judul: 'Semester Empat',
    tahunAjaran: 'Genap Tahun Ajaran 2024/2025',
    ips: 3.78,
    totalSks: 24,
    matkul: [
      { nomor: 7, nama: 'Kewirausahaan', kode: 'VTI51310', sks: 2, grade: 'A' },
      { nomor: 6, nama: 'UI/UX Design', kode: 'VTI51315', sks: 3, grade: 'A+' },
      { nomor: 5, nama: 'Internet of Things (IoT)', kode: 'VTI51340', sks: 3, grade: 'B+' },
      { nomor: 4, nama: 'Statistika Komputasi', kode: 'VTI51389', sks: 3, grade: 'B+' },
      { nomor: 3, nama: 'Rekayasa Perangkat Lunak', kode: 'VTI51375', sks: 4, grade: 'A' },
      { nomor: 2, nama: 'Keamanan Siber & Jaringan', kode: 'VTI51322', sks: 4, grade: 'A' },
      { nomor: 1, nama: 'Kecerdasan Buatan', kode: 'VTI51366', sks: 3, grade: 'A+' },
    ],
  },
  {
    judul: 'Semester Tiga',
    tahunAjaran: 'Ganjil Tahun Ajaran 2024/2025',
    ips: 3.90,
    totalSks: 20,
    matkul: [
      { nomor: 4, nama: 'Pemrograman Web', kode: 'VTI51329', sks: 4, grade: 'A+' },
      { nomor: 3, nama: 'Basis Data Terdistribusi', kode: 'VTI51250', sks: 4, grade: 'A' },
      { nomor: 2, nama: 'Jaringan Komputer', kode: 'VTI51261', sks: 3, grade: 'B+' },
      { nomor: 1, nama: 'Interaksi Manusia & Komputer', kode: 'VTI51270', sks: 3, grade: 'A' },
    ],
  },
  {
    judul: 'Semester Dua',
    tahunAjaran: 'Genap Tahun Ajaran 2023/2024',
    ips: 4.00,
    totalSks: 21,
    matkul: [
      { nomor: 3, nama: 'Struktur Data & Algoritma', kode: 'VTI51180', sks: 4, grade: 'A' },
      { nomor: 2, nama: 'Sistem Operasi', kode: 'VTI51191', sks: 3, grade: 'A' },
      { nomor: 1, nama: 'Pemrograman Mobile', kode: 'VTI51203', sks: 3, grade: 'A+' },
    ],
  },
  {
    judul: 'Semester Satu',
    tahunAjaran: 'Ganjil Tahun Ajaran 2023/2024',
    ips: 3.80,
    totalSks: 20,
    matkul: [
      { nomor: 4, nama: 'Algoritma & Pemrograman', kode: 'VTI51101', sks: 4, grade: 'A' },
      { nomor: 3, nama: 'Matematika Dasar', kode: 'VTI51102', sks: 3, grade: 'A' },
      { nomor: 2, nama: 'Logika & Pemrograman', kode: 'VTI51103', sks: 3, grade: 'B+' },
      { nomor: 1, nama: 'Pengantar Teknologi Informasi', kode: 'VTI51104', sks: 3, grade: 'A+' },
    ],
  },
];

// --- FORMATTER FUNCTION ---
function formatUser(u: any) {
  if (!u) return null;

  let alternativeEmails: string[] = [];
  if (u.alternativeEmails) {
    try {
      const parsed = typeof u.alternativeEmails === 'string' 
        ? JSON.parse(u.alternativeEmails) 
        : u.alternativeEmails;
      alternativeEmails = Array.isArray(parsed) ? parsed : [parsed];
    } catch (_) {
      alternativeEmails = [String(u.alternativeEmails)];
    }
  }

  let mataKuliah: string[] = [];
  if (u.mataKuliah) {
    try {
      const parsed = typeof u.mataKuliah === 'string' 
        ? JSON.parse(u.mataKuliah) 
        : u.mataKuliah;
      mataKuliah = Array.isArray(parsed) ? parsed : [parsed];
    } catch (_) {
      mataKuliah = [String(u.mataKuliah)];
    }
  }

  return {
    ...u,
    semester: u.role === 'mahasiswa' ? (u.semester || 4) : undefined,
    alternativeEmails,
    mataKuliah: u.role === 'dosen' ? mataKuliah : undefined,
  };
}

/**
 * Reset dan sync database MySQL eduinsight_db dengan data master (Mobile + Web)
 */
async function syncDatabaseWithFrontend(): Promise<void> {
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

    // 4. Sync Tugas - DISABLED: Tugas dibuat real-time oleh dosen dari web, jangan diisi dummy seed
    // for (const t of MASTER_TUGAS) {
    //   await prisma.tugas.upsert({
    //     where: { id: t.id },
    //     update: {
    //       kelasId: t.kelasId,
    //       judul: t.judul,
    //       deskripsi: t.deskripsi,
    //       lampiran: t.lampiran,
    //       deadline: t.deadline,
    //       deadlineText: t.deadlineText,
    //       category: t.category,
    //     },
    //     create: {
    //       id: t.id,
    //       kelasId: t.kelasId,
    //       judul: t.judul,
    //       deskripsi: t.deskripsi,
    //       lampiran: t.lampiran,
    //       deadline: t.deadline,
    //       deadlineText: t.deadlineText,
    //       category: t.category,
    //     },
    //   });
    // }

    // 5. Sync Kehadiran - DISABLED: Kehadiran diisi real-time oleh dosen dari web, jangan diisi dummy
    // for (const kh of MASTER_KEHADIRAN) {
    //   await prisma.kehadiran.upsert({ ... });
    // }

    // 6. Sync Evaluasi - DISABLED: Evaluasi dibuat real-time oleh AI / Dosen, jangan diisi dummy
    // for (const ev of MASTER_EVALUASI) {
    //   await prisma.evaluasi.upsert({ ... });
    // }

    // 7. Sync Penilaian - DISABLED: Nilai diisi real-time oleh dosen dari web, jangan diisi dummy seed
    // for (const p of MASTER_PENILAIAN) {
    //   await prisma.penilaian.upsert({ ... });
    // }

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
  } catch (err: any) {
    console.error('❌ Database sync error:', err.message);
  }
}

async function initDatabase(): Promise<void> {
  await syncDatabaseWithFrontend();
}

async function findUserByEmail(email: string | null | undefined) {
  if (!email) return null;
  const target = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: target } },
        { nip: { equals: target } },
        { nim: { equals: target } },
      ],
    },
  });

  if (user) {
    return formatUser(user);
  }

  const allUsers = await prisma.user.findMany();
  for (const u of allUsers) {
    if (u.alternativeEmails) {
      try {
        const altList = typeof u.alternativeEmails === 'string' 
          ? JSON.parse(u.alternativeEmails) 
          : u.alternativeEmails;

        if (Array.isArray(altList) && altList.some((e: string) => e.toLowerCase() === target)) {
          return formatUser(u);
        }
      } catch (e) {
        if (String(u.alternativeEmails).toLowerCase().includes(target)) {
          return formatUser(u);
        }
      }
    }
  }

  return null;
}

async function findUserById(id: string) {
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

async function createUser(userData: any) {
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

async function updateUser(id: string, updateData: any) {
  const updated = await prisma.user.update({
    where: { id },
    data: updateData,
  });
  return formatUser(updated);
}

async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } });
}

async function updateUserPassword(email: string, newHashedPassword: string) {
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

async function blacklistToken(token: string) {
  try {
    await prisma.tokenBlacklist.create({
      data: { token },
    });
  } catch (err) {}
}

async function isTokenBlacklisted(token: string) {
  if (!token) return false;
  const found = await prisma.tokenBlacklist.findUnique({
    where: { token },
  });
  return !!found;
}

// Catatan (Notes)
async function getUserNotes(userId: string) {
  return await prisma.note.findMany({
    where: { userId },
    orderBy: { id: 'desc' },
  });
}

async function createNote(userId: string, title: string, body: string) {
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

export {
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
  MASTER_NILAI_SEMESTER,
};