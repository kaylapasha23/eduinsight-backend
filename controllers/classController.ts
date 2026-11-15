import { Request, Response } from 'express';
import { prisma } from '../data/database.js';

// Mengambil semua data kelas & jadwal
export const getAllClasses = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { day } = req.query;
    const where = day && day !== 'Semua' ? { hari: String(day) } : {};

    const classes = await prisma.kelas.findMany({
      where,
      include: {
        mataKuliah: true,
        dosen: true,
      },
      orderBy: { id: 'asc' },
    });

    const formatted = classes.map((k: any) => ({
      id: k.id,
      code: k.kodeGabung,
      name: k.mataKuliah ? k.mataKuliah.nama : 'Mata Kuliah',
      sks: k.mataKuliah ? k.mataKuliah.sks : 3,
      semester: k.semester,
      dosen_id: k.dosenId,
      dosen_name: k.dosen ? k.dosen.name : 'Dosen Pengampu',
      class_room: k.ruangan,
      classRoom: k.ruangan,
      schedule_day: k.hari,
      schedule_time: `${k.jamMulai} - ${k.jamSelesai} WIB`,
      schedule: `${k.hari} ${k.jamMulai}-${k.jamSelesai}`,
      created_at: k.createdAt,
    }));

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Mengambil kelas berdasarkan ID
export const getClassById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const k: any = await prisma.kelas.findUnique({
      where: { id: String(id) },
      include: {
        mataKuliah: true,
        dosen: true,
      },
    });

    if (!k) {
      return res.status(404).json({ success: false, message: 'Data kelas tidak ditemukan' });
    }

    const formatted = {
      id: k.id,
      code: k.kodeGabung,
      name: k.mataKuliah ? k.mataKuliah.nama : 'Mata Kuliah',
      sks: k.mataKuliah ? k.mataKuliah.sks : 3,
      semester: k.semester,
      dosen_id: k.dosenId,
      dosen_name: k.dosen ? k.dosen.name : 'Dosen Pengampu',
      class_room: k.ruangan,
      classRoom: k.ruangan,
      schedule_day: k.hari,
      schedule_time: `${k.jamMulai} - ${k.jamSelesai} WIB`,
      schedule: `${k.hari} ${k.jamMulai}-${k.jamSelesai}`,
      created_at: k.createdAt,
    };

    return res.status(200).json(formatted);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Menambah kelas baru
export const createClass = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { code, name, sks, ruangan, classRoom, schedule, schedule_day, schedule_time } = req.body;

    const classCode = code || `MK-${Date.now().toString().slice(-4)}`;
    let matkul = await prisma.mataKuliah.findUnique({ where: { kode: classCode } });
    if (!matkul) {
      matkul = await prisma.mataKuliah.create({
        data: {
          id: `mk-${Date.now()}`,
          kode: classCode,
          nama: name || 'Mata Kuliah Baru',
          sks: sks ? Number(sks) : 3,
        },
      });
    }

    const dosen = await prisma.user.findFirst({ where: { role: 'dosen' } });

    const roomVal = ruangan || classRoom || 'Ruang Kuliah';
    let dayVal = schedule_day || 'Senin';
    let startVal = '08.00';
    let endVal = '10.00';

    const rawSched = schedule || schedule_time || '';
    if (rawSched) {
      const parts = rawSched.trim().split(' ');
      if (['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].includes(parts[0])) {
        dayVal = parts[0];
        const timePart = parts.slice(1).join(' ').replace('WIB', '').trim();
        if (timePart.includes('-')) {
          startVal = timePart.split('-')[0].trim();
          endVal = timePart.split('-')[1]?.trim() || '10.00';
        }
      } else if (rawSched.includes('-')) {
        startVal = rawSched.split('-')[0].trim();
        endVal = rawSched.split('-')[1]?.trim() || '10.00';
      }
    }

    const newKelas = await prisma.kelas.create({
      data: {
        id: `kelas-${Date.now()}`,
        kodeGabung: classCode,
        ruangan: roomVal,
        hari: dayVal,
        jamMulai: startVal,
        jamSelesai: endVal,
        mataKuliahId: matkul.id,
        dosenId: dosen ? dosen.id : 'user-dsn-001',
      },
    });

    return res.status(201).json({ success: true, message: 'Kelas berhasil ditambahkan', id: newKelas.id });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

// Menghapus kelas berdasarkan ID
export const deleteClass = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    await prisma.kelas.delete({ where: { id: String(id) } });
    return res.status(200).json({ success: true, message: `Kelas dengan ID ${id} berhasil dihapus` });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
};

export default {
  getAllClasses,
  getClasses: getAllClasses,
  getClassById,
  createClass,
  deleteClass,
};