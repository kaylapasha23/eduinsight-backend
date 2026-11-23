import { prisma } from '../data/database.js';

// Map jadwal per mata kuliah
export const jadwalMap: Record<string, string> = {
  'Kecerdasan Buatan': '14.00-15.20 Lantai 7, Ruangan 701',
  'Pemrograman Web': '08.00-10.00 Lantai 5, Ruang 502',
  'Basis Data Terdistribusi': '12.00-14.00 Lantai 6, Ruang 606',
  'Keamanan Siber & Jaringan': '10.00-12.00 Lab Keamanan, Lantai 4',
  'Rekayasa Perangkat Lunak': '08.00-10.30 Lantai 3, Ruang 304',
  'Statistika Komputasi': '13.30-15.00 Lantai 2, Ruang 201',
  'Kewirausahaan': '08.00-09.40 Lantai 4, Ruang 401',
  'UI/UX Design': '13.00-15.30 Lab Multimedia, Lantai 3',
  'Internet of Things (IoT)': '15.00-17.30 Lab Hardware & IoT, Lantai 5',
};

const defaultTopikByCourse: Record<string, string[]> = {
  'Kecerdasan Buatan': [
    'Pengenalan AI & Sejarah',
    'Agen Cerdas & Lingkungan',
    'Pencarian Buta (BFS/DFS)',
    'Pencarian Heuristik & A*',
    'Logika Proposisi & Inferensi',
    'Machine Learning Dasar',
    'Evaluasi & Review Pembelajaran AI',
  ],
  'Pemrograman Web': [
    'Dasar HTML, CSS & Semantik',
    'JavaScript Modern ES6+ & DOM',
    'React: Komponen & State',
    'React: Hooks & Routing',
    'Integrasi REST API & Axios',
    'State Management & Redux/Zustand',
    'Deployment & Evaluasi Web App',
  ],
  'Basis Data Terdistribusi': [
    'Pengantar Basis Data Terdistribusi',
    'Model Data & Skema Terdistribusi',
    'Fragmentasi & Replikasi Data',
    'Query Terdistribusi & Optimasi',
    'Transaksi Terdistribusi & Konkurensi',
    'Replikasi & Sharding Lanjutan',
    'Review Arsitektur & Evaluasi Sistem',
  ],
  'Keamanan Siber & Jaringan': [
    'Pengantar Keamanan Siber',
    'Dasar Kriptografi & Hash',
    'Kriptografi Asimetris & Sertifikat Digital',
    'Keamanan Protokol & Firewall',
    'Analisis Malware & Deteksi Serangan',
    'Penetration Testing & Vulnerability',
    'Evaluasi Postur Keamanan & Audit',
  ],
  'Rekayasa Perangkat Lunak': [
    'Pengantar RPL & Software Process',
    'Analisis Kebutuhan & SRS',
    'UML Design & Arsitektur Perangkat Lunak',
    'Desain Arsitektur & Clean Architecture',
    'Unit Testing, TDD & CI/CD',
    'Agile Scrum & Sprint Execution',
    'Review Proyek & Evaluasi Kualitas',
  ],
  'Pemrograman Framework': [
    'Pengenalan Framework & Arsitektur MVC',
    'Routing, Controller & Request Lifecycle',
    'Database ORM / Prisma & Migrasi',
    'Autentikasi, JWT & Middleware',
    'RESTful API Development & Validasi',
    'Testing, Error Handling & Logging',
    'Deployment Production & Review Akhir',
  ],
  'Statistika Komputasi': [
    'Statistika Deskriptif & Visualisasi Data',
    'Distribusi Probabilitas & Sampling',
    'Uji Hipotesis & Signifikansi',
    'Regresi Linier & Korelasi',
    'ANOVA & Uji Multivariat',
    'Analisis Deret Waktu & Clustering',
    'Evaluasi Model Statistik & Ujian',
  ],
  'Kewirausahaan': [
    'Pola Pikir & Mindset Kewirausahaan',
    'Identifikasi Masalah & Peluang Pasar',
    'Business Model Canvas (BMC) & Value Prop',
    'Riset Pasar & Validasi Produk (MVP)',
    'Strategi Pemasaran & Go-To-Market',
    'Perencanaan Finansial & Unit Economics',
    'Pitch Deck & Evaluasi Usaha',
  ],
  'UI/UX Design': [
    'Pengantar Desain Produk & Design Thinking',
    'User Research, Persona & User Journey',
    'Information Architecture & Wireframing',
    'Desain Sistem & Komponen Figma',
    'High-Fidelity Prototyping & Interaksi',
    'Usability Testing & Feedback Loop',
    'Design Hand-off & Portofolio Review',
  ],
  'Internet of Things (IoT)': [
    'Pengenalan IoT & Ekosistem Perangkat',
    'Mikrokontroler ESP32 & Pemrograman C++',
    'Sensor, Aktuator & Antarmuka I/O',
    'Protokol Komunikasi IoT (MQTT & HTTP)',
    'Konektivitas Cloud & Visualisasi Data',
    'Edge Computing & Automasi Cerdas',
    'Demo Proyek IoT & Evaluasi Sistem',
  ],
};

const defaultDates: string[] = [
  '29 September 2026',
  '6 Oktober 2026',
  '13 Oktober 2026',
  '20 Oktober 2026',
  '27 Oktober 2026',
  '3 November 2026',
  '10 November 2026',
];

export interface KehadiranFilter {
  class_id?: string | number;
  kelasId?: string | number;
  nomor?: string | number;
  meeting?: string | number;
  view?: string;
  page?: string | number;
  limit?: string | number;
  studentName?: string;
}

export const getKehadiranService = async (filter: KehadiranFilter) => {
  const { class_id, kelasId, meeting, nomor, page = '1', limit = '10', studentName } = filter;

  const pageNum = Math.max(1, parseInt(String(page), 10) || 1);
  const limitNum = Math.max(1, parseInt(String(limit), 10) || 10);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};
  const targetKelasId = String(kelasId || class_id || '').trim();

  // 1. Terapkan filter kelasId / class_id jika ada
  if (targetKelasId && targetKelasId !== 'Semua') {
    where.OR = [
      { kelasId: targetKelasId },
      { namaMatkul: targetKelasId },
      { namaMatkul: { contains: targetKelasId } },
    ];
  }

  // 2. Terapkan filter nomor pertemuan jika ada
  const rawNomor = nomor !== undefined && nomor !== null && nomor !== '' ? nomor : meeting;
  let parsedNomor: number | null = null;
  if (rawNomor !== undefined && rawNomor !== null && String(rawNomor).trim() !== '') {
    const num = parseInt(String(rawNomor).replace(/\D/g, ''), 10);
    if (!isNaN(num)) {
      where.nomor = num;
      parsedNomor = num;
    }
  }

  const list = await prisma.kehadiran.findMany({
    where,
    orderBy: [{ nomor: 'asc' }, { id: 'asc' }],
  });

  // Kelompokkan data per mata kuliah untuk tampilan mobile / riwayat (selalu 7 pertemuan per matkul)
  const grouped: Record<string, any> = {};

  // 1. Siapkan seluruh 10 mata kuliah dari tabel kelas
  const masterKelas = await prisma.kelas.findMany({
    include: { mataKuliah: true },
    orderBy: { id: 'asc' },
  });

  for (const k of masterKelas) {
    const mkName = k.mataKuliah?.nama || 'Mata Kuliah';
    const topics = defaultTopikByCourse[mkName] || [
      'Pertemuan 1', 'Pertemuan 2', 'Pertemuan 3', 'Pertemuan 4', 'Pertemuan 5', 'Pertemuan 6', 'Pertemuan 7'
    ];

    // Petakan data presensi di DB untuk matkul ini dan studentName target (jika difilter)
    const userAttendance = new Map<number, any>();
    for (const item of list) {
      const matchMatkul = (item.namaMatkul || '') === mkName || item.kelasId === k.id;
      if (matchMatkul) {
        if (studentName) {
          if ((item.studentName || '').toLowerCase().trim() !== studentName.toLowerCase().trim()) {
            continue;
          }
        }
        userAttendance.set(item.nomor, item);
      }
    }

    // Bangun riwayat pertemuan: HANYA sertakan pertemuan yang SUDAH diinput oleh dosen
    const riwayat = [];
    for (let num = 7; num >= 1; num--) {
      const existing = userAttendance.get(num);
      if (existing) {
        riwayat.push({
          nomor: num,
          topik: `Pertemuan ${num}`,
          tanggal: existing.tanggal || 'Hari ini',
          status: existing.status === 'Alpa' ? 'Alpa' : existing.status,
          hasData: true,
        });
      }
    }

    grouped[mkName] = {
      nama: mkName,
      jadwal: jadwalMap[mkName] || `${k.hari}, ${k.jamMulai} - ${k.jamSelesai} ${k.ruangan}`,
      riwayat: riwayat,
    };
  }

  // 3. Ambil data users mahasiswa aktif (dengan pagination) sehingga tabel selalu menampilkan 4 nama mahasiswa
  const [totalMhs, mhsUsers] = await Promise.all([
    prisma.user.count({ where: { role: 'mahasiswa' } }),
    prisma.user.findMany({
      where: { role: 'mahasiswa' },
      orderBy: { name: 'asc' },
      skip,
      take: limitNum,
    }),
  ]);

  // Petakan record kehadiran per nama mahasiswa untuk nomor pertemuan ini
  const attendanceByName = new Map<string, any>();
  for (const item of list) {
    const key = (item.studentName || '').toLowerCase().trim();
    if (!attendanceByName.has(key)) {
      attendanceByName.set(key, item);
    }
  }

  // Format list presensi mahasiswa per mahasiswa (tepat 1 baris per mahasiswa, tidak ada duplikasi)
  const studentList = mhsUsers.map((user, idx) => {
    const key = (user.name || '').toLowerCase().trim();
    const item = attendanceByName.get(key);

    const sName = user.name || 'Mahasiswa';
    const statusVal = item ? (item.status === 'Alpa' ? 'Alpha' : (item.status || 'Hadir')) : 'Hadir';
    const meetingNum = item?.nomor || parsedNomor || 1;
    const dateVal = item?.tanggal || 'Senin, 29 September 2026';
    const createdAtDate = item?.createdAt || user.createdAt;
    const itemTimestamp = createdAtDate ? createdAtDate.toISOString() : new Date().toISOString();

    return {
      id: item?.id || `khd-${user.id}-${meetingNum}`,
      class_id: targetKelasId || item?.kelasId || 'kelas-ai',
      kelasId: targetKelasId || item?.kelasId || 'kelas-ai',
      student_name: sName,
      studentName: sName,
      name: sName,
      nim: user.nim || `22010100${idx + 1}`,
      status: statusVal,
      course: item?.namaMatkul || targetKelasId || 'Mata Kuliah',
      nomor: meetingNum,
      topik: item?.topik || `Materi Pertemuan ${meetingNum}`,
      date: dateVal,
      tanggal: dateVal,
      createdAt: createdAtDate,
      timestamp: itemTimestamp,
      waktu: createdAtDate ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(createdAtDate)) : dateVal,
      finalScore: 85.0 + ((idx * 3) % 12),
      gradeHistory: 'Tugas 88 · Kuis 80 · UTS 84 · UAS 88',
      notes: statusVal === 'Hadir' ? 'Aktif dan tepat waktu di kelas' : 'Perlu konfirmasi surat izin/sakit',
    };
  });

  return {
    list,
    studentList,
    grouped,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: totalMhs,
      totalPages: Math.ceil(totalMhs / limitNum),
    },
  };
};

export const createKehadiranService = async (payload: any) => {
  const {
    matkul_name,
    nomor,
    topik,
    tanggal,
    date,
    status,
    class_id,
    kelasId,
    student_name,
    studentName,
    name,
  } = payload;

  const sName = student_name || studentName || name || 'Mahasiswa';
  const tgl = tanggal || date || new Date().toISOString().split('T')[0];
  const rawClassId = String(class_id || kelasId || '');

  let validKelas = rawClassId ? await prisma.kelas.findUnique({ where: { id: rawClassId } }) : null;
  if (!validKelas) {
    validKelas = await prisma.kelas.findFirst();
  }
  const targetKelasId = validKelas ? validKelas.id : 'kelas-ai';
  const cleanStatus = status === 'Alpha' ? 'Alpa' : (status || 'Hadir');
  const meetingNumber = nomor ? Number(nomor) : 1;

  // Cek apakah data kehadiran sudah ada untuk kelasId, nomor pertemuan, dan studentName ini (mencegah duplikasi data saat simpan berulang kali)
  const existingKhd = await prisma.kehadiran.findFirst({
    where: {
      kelasId: targetKelasId,
      nomor: meetingNumber,
      studentName: sName,
    },
  });

  if (existingKhd) {
    const updated = await prisma.kehadiran.update({
      where: { id: existingKhd.id },
      data: {
        status: cleanStatus,
        tanggal: tgl,
        namaMatkul: matkul_name || existingKhd.namaMatkul,
        topik: `Pertemuan ${meetingNumber}`,
        createdAt: new Date(),
      },
    });
    return {
      ...updated,
      createdAt: updated.createdAt,
      timestamp: updated.createdAt ? updated.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  const newKhd = await prisma.kehadiran.create({
    data: {
      id: `khd-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      kelasId: targetKelasId,
      namaMatkul: matkul_name || (validKelas ? 'Mata Kuliah' : 'Kecerdasan Buatan'),
      studentName: sName,
      nomor: meetingNumber,
      topik: `Pertemuan ${meetingNumber}`,
      tanggal: tgl,
      status: cleanStatus,
      createdAt: new Date(),
    },
  });

  return {
    ...newKhd,
    createdAt: newKhd.createdAt,
    timestamp: newKhd.createdAt ? newKhd.createdAt.toISOString() : new Date().toISOString(),
  };
};

export const deleteKehadiranService = async (id: string) => {
  return prisma.kehadiran.delete({ where: { id: String(id) } }).catch(() => null);
};

export default {
  getKehadiranService,
  createKehadiranService,
  deleteKehadiranService,
};
