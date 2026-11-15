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
      schedule_day: k.hari,
      schedule_time: `${k.jamMulai} - ${k.jamSelesai} WIB`,
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
    const k = await prisma.kelas.findUnique({
      where: { id },
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
      schedule_day: k.hari,
      schedule_time: `${k.jamMulai} - ${k.jamSelesai} WIB`,
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
    const { code, name, sks, ruangan, schedule_day, schedule_time } = req.body;

    let matkul = await prisma.mataKuliah.findUnique({ where: { kode: code } });
    if (!matkul) {
      matkul = await prisma.mataKuliah.create({
        data: {
          kode: code,
          nama: name || 'Mata Kuliah Baru',
          sks: sks ? Number(sks) : 3,
        },
      });
    }

    const dosen = await prisma.user.findFirst({ where: { role: 'dosen' } });

    const newKelas = await prisma.kelas.create({
      data: {
        id: `kelas-${Date.now()}`,
        kodeGabung: code,
        ruangan: ruangan || 'Ruang Kuliah',
        hari: schedule_day || 'Senin',
        jamMulai: schedule_time ? schedule_time.split('-')[0].trim() : '08.00',
        jamSelesai: schedule_time ? schedule_time.split('-')[1]?.trim() : '10.00',
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
    await prisma.kelas.delete({ where: { id } });
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