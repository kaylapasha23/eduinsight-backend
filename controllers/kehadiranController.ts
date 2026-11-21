import { Request, Response } from 'express';
import kehadiranService from '../services/kehadiranService.js';

// GET /api/kehadiran
export const getKehadiran = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { class_id, kelasId, meeting, nomor, view } = req.query;

    const { list, studentList, grouped } = await kehadiranService.getKehadiranService({
      class_id: class_id as string,
      kelasId: kelasId as string,
      meeting: meeting as string,
      nomor: nomor as string,
      view: view as string,
    });

    if (view === 'courses') {
      const result = Object.values(grouped);
      return res.status(200).json({
        success: true,
        data: result,
        total_matkul: result.length,
        updated_at: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      data: studentList,
      courses: Object.values(grouped),
      total: studentList.length,
      total_matkul: Object.keys(grouped).length,
      updated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[GET KEHADIRAN ERROR]:', err);
    return res.status(500).json({
      success: false,
      message: 'Gagal mengambil data kehadiran',
      error: err?.message || err,
    });
  }
};

// POST /api/kehadiran
export const createKehadiran = async (req: Request, res: Response): Promise<Response> => {
  try {
    const newKhd = await kehadiranService.createKehadiranService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Data kehadiran berhasil dicatat',
      data: newKhd,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || err });
  }
};

export const deleteKehadiran = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    if (id) {
      await kehadiranService.deleteKehadiranService(String(id));
    }
    return res.status(200).json({ success: true, message: 'Data kehadiran berhasil dihapus' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err?.message || err });
  }
};

export default {
  getKehadiran,
  getAllKehadiran: getKehadiran,
  createKehadiran,
  deleteKehadiran,
};
