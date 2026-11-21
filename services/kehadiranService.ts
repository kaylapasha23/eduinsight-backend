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

export interface KehadiranFilter {
  class_id?: string | number;
  kelasId?: string | number;
  nomor?: string | number;
  meeting?: string | number;
  view?: string;
}

export const getKehadiranService = async (filter: KehadiranFilter) => {
  const { class_id, kelasId, meeting, nomor } = filter;

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
  if (rawNomor !== undefined && rawNomor !== null && String(rawNomor).trim() !== '') {
    const num = parseInt(String(rawNomor).replace(/\D/g, ''), 10);
    if (!isNaN(num)) {
      where.nomor = num;
    }
  }

  const list = await prisma.kehadiran.findMany({
    where,
    orderBy: [{ nomor: 'asc' }, { id: 'asc' }],
  });

  // Kelompokkan data per mata kuliah
  const grouped: Record<string, any> = {};
  for (const item of list) {
    const mkName = item.namaMatkul || 'Mata Kuliah';
    if (!grouped[mkName]) {
      grouped[mkName] = {
        nama: mkName,
        jadwal: jadwalMap[mkName] || '14.00-15.20 Ruang Kuliah',
        riwayat: [],
      };
    }
    grouped[mkName].riwayat.push({
      nomor: item.nomor,
      topik: item.topik,
      tanggal: item.tanggal,
      status: item.status,
    });
  }

  // Ambil data users mahasiswa untuk mapping NIM
  const mhsUsers = await prisma.user.findMany({ where: { role: 'mahasiswa' } });
  const userNimMap = new Map<string, string>();
  for (const u of mhsUsers) {
    if (u.name) userNimMap.set(u.name.toLowerCase().trim(), u.nim || '');
  }

  // Format list presensi mahasiswa per pertemuan
  const studentList = list.map((item, idx) => {
    const sName = item.studentName || 'Mahasiswa';
    const matchedNim = userNimMap.get(sName.toLowerCase().trim()) || `22010100${(idx % 10) + 1}`;
    const itemTimestamp = item.createdAt ? item.createdAt.toISOString() : new Date().toISOString();
    return {
      id: item.id,
      class_id: item.kelasId,
      kelasId: item.kelasId,
      student_name: sName,
      studentName: sName,
      name: sName,
      nim: matchedNim,
      status: item.status === 'Alpa' ? 'Alpha' : (item.status || 'Hadir'),
      course: item.namaMatkul || 'Mata Kuliah',
      nomor: item.nomor,
      topik: item.topik,
      date: item.tanggal,
      tanggal: item.tanggal,
      createdAt: item.createdAt,
      timestamp: itemTimestamp,
      waktu: item.createdAt ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(item.createdAt)) : item.tanggal,
      finalScore: 85.0 + ((idx * 3) % 12),
      gradeHistory: 'Tugas 88 · Kuis 80 · UTS 84 · UAS 88',
      notes: item.status === 'Hadir' ? 'Aktif dan tepat waktu di kelas' : 'Perlu konfirmasi surat izin/sakit',
    };
  });

  return {
    list,
    studentList,
    grouped,
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
        topik: topik || existingKhd.topik,
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
      topik: topik || 'Materi Perkuliahan',
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
