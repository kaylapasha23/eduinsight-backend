const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const USERS_FILE = path.join(__dirname, 'users.json');

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
    mataKuliah: ['Kecerdasan Buatan'],
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

// Data Mata Kuliah persis sesuai academic.dart & nilai.dart
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
];

// Data Kelas perkuliahan persis sesuai academic.dart & gabung_kelas_screen.dart
const MASTER_KELAS = [
  {
    id: 'kelas-ai',
    kodeGabung: 'VTI51366', // sesuai kode mata kuliah di frontend
    ruangan: 'Lantai 7, Ruangan 701',
    hari: 'Senin',
    jamMulai: '14.00',
    jamSelesai: '15.20',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51366',
    dosenNip: '198503152010121002', // Dr. Ahmad Sahroni, M.Kom.
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
    dosenNip: '198204122008122001', // Ir. Tri Astuti, M.T.
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
    dosenNip: '198709232014041001', // Teddy Indra Wijaya, M.Kom.
  },
  {
    id: 'kelas-cyber',
    kodeGabung: 'VTI51322', // contoh di hint gabung_kelas_screen: VTI51322
    ruangan: 'Lab Keamanan, Lantai 4',
    hari: 'Kamis',
    jamMulai: '10.00',
    jamSelesai: '12.00',
    semester: 6,
    tahunAjaran: '2025/2026 Genap',
    status: 'Aktif',
    matkulKode: 'VTI51322',
    dosenNip: '197105151998031002', // Prof. Bambang Hariyanto, Ph.D.
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
    dosenNip: '198911202015041003', // Ivan Gunawan, M.Ds.
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
    dosenNip: '196802101993032001', // Dra. Endang Sulistyo, M.Stat.
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
    dosenNip: '197906142005012003', // Dr. Rini Handayani, M.M.
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
    dosenNip: '198911202015041003', // Ivan Gunawan, M.Ds.
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
    dosenNip: '198709232014041001', // Teddy Indra Wijaya, M.Kom.
  },
];

// Data Tugas persis sesuai detail_tugas_screen.dart & kelas_screen.dart
const MASTER_TUGAS = [
  // 1. Kewirausahaan (Tugas Segera)
  {
    id: 'tugas-kwu-01',
    kelasId: 'kelas-kwu',
    judul: 'Tugas 1 - Quiziz',
    deskripsi: 'Kerjakan kuis Kewirausahaan melalui Quizizz materi BMC (Business Model Canvas).\n\n• Kerjakan tepat waktu sebelum tenggat\n• Screenshot nilai akhir kuis dan lampirkan sebagai bukti pengerjaan tugas.',
    lampiran: 'Panduan_Kuis_Kewirausahaan.pdf',
    deadline: new Date(Date.now() + 4 * 60 * 60 * 1000), // Hari ini, 23.59
  },
  // 2. UI/UX Design (Tugas Segera)
  {
    id: 'tugas-uiux-01',
    kelasId: 'kelas-uiux',
    judul: 'Tugas 1 - Analisa Aplikasi',
    deskripsi: 'Lakukan analisa heuristik pada aplikasi mobile EduTech pilihanmu.\n\n• Identifikasi 5 masalah usability beserta rekomendasi perbaikannya\n• Kumpulkan dalam format PDF rangkuman laporan.',
    lampiran: 'Template_Analisa_Heuristik.pdf',
    deadline: new Date(Date.now() + 5 * 60 * 60 * 1000), // Hari ini, 23.59
  },
  // 3. IoT (Tugas Segera)
  {
    id: 'tugas-iot-01',
    kelasId: 'kelas-iot',
    judul: 'Pertemuan Pertama',
    deskripsi: 'Buat rangkuman singkat mengenai komponen mikrokontroler ESP32 dan protokol MQTT.\n\n• Format: PDF (maksimal 2 halaman)\n• Unggah dokumen hasil resume pada bagian Tugas Saya di bawah.',
    lampiran: null,
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Rabu, 23.59
  },
  // 4. Kecerdasan Buatan (Tugas Selesai / Diserahkan)
  {
    id: 'tugas-ai-01',
    kelasId: 'kelas-ai',
    judul: 'Tugas Pengenalan AI',
    deskripsi: 'Rangkuman pengantar AI, perbedaan antara machine learning dan deep learning, serta implementasi agen cerdas.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Modul_Pengenalan_AI.pdf',
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Minggu Lalu
  },
  {
    id: 'tugas-ai-02',
    kelasId: 'kelas-ai',
    judul: 'AI Klasik dan Modern',
    deskripsi: 'Studi kasus perbandingan algoritma pencarian BFS/DFS dan A* Search pada implementasi maze routing.',
    lampiran: null,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  // 5. Basis Data Terdistribusi (Tugas Selesai / Diserahkan)
  {
    id: 'tugas-basdat-01',
    kelasId: 'kelas-basdat',
    judul: 'Latihan SQL Dasar',
    deskripsi: 'Latihan query DDL & DML, join relasi tabel, dan agregasi data pada MySQL / PostgreSQL.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Soal_Latihan_SQL.pdf',
    deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Minggu Lalu
  },
  // 6. Pemrograman Web (Tugas Selesai / Diserahkan)
  {
    id: 'tugas-web-01',
    kelasId: 'kelas-web',
    judul: 'Tugas Array & Function',
    deskripsi: 'Implementasi logika manipulasi array dan closure function pada JavaScript ES6+.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Panduan_Array_Function.pdf',
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 Minggu Lalu
  },
  // 7. IoT (Laporan Praktikum Selesai)
  {
    id: 'tugas-iot-02',
    kelasId: 'kelas-iot',
    judul: 'Laporan Praktikum 1',
    deskripsi: 'Laporan hasil pembacaan sensor DHT22 ke serial monitor dan simulasi Wokwi.\n\nStatus: Sudah diserahkan tepat waktu.',
    lampiran: 'Modul_Praktikum_IoT_1.pdf',
    deadline: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 Minggu Lalu
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
 * Reset dan sync database dengan data master frontend
 */
async function syncDatabaseWithFrontend() {
  try {
    // 1. Sync / Upsert Users
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

    // 3. Sync Kelas (Hubungkan ke Matkul & Dosen Pengampu yang sesuai)
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
          lampiran: t.lampiran,
          kelasId: t.kelasId,
        },
        create: {
          id: t.id,
          judul: t.judul,
          deskripsi: t.deskripsi,
          deadline: t.deadline,
          lampiran: t.lampiran,
          kelasId: t.kelasId,
        },
      });
    }

    // Hapus data dummy lama yang salah (seperti dummy 'mk-ai-001' atau 'kelas-ai-01' lama)
    await prisma.tugas.deleteMany({
      where: {
        id: { notIn: MASTER_TUGAS.map((t) => t.id) },
      },
    }).catch(() => {});

    await prisma.kelas.deleteMany({
      where: {
        id: { notIn: MASTER_KELAS.map((k) => k.id) },
      },
    }).catch(() => {});

    await prisma.mataKuliah.deleteMany({
      where: {
        kode: { notIn: MASTER_MATKUL.map((m) => m.kode) },
      },
    }).catch(() => {});
  } catch (err) {
    console.error('Database sync error:', err.message);
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
      id: userData.id,
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

module.exports = {
  prisma,
  initDatabase,
  getUsers,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserPassword,
  blacklistToken,
  isTokenBlacklisted,
  DEFAULT_USERS,
};
