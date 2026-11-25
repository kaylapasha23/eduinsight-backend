import { Request, Response } from 'express';
import { prisma } from '../data/database.js';
import kehadiranService from '../services/kehadiranService.js';
import { createAndSendNotification } from '../services/fcmService.js';

// GET /api/kehadiran
export const getKehadiran = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { class_id, kelasId, meeting, nomor, view, page, limit } = req.query;
    const user = (req as any).user;
    const studentName = (req.query.studentName || req.query.student_name || (user?.role === 'mahasiswa' ? user.name : undefined)) as string | undefined;

    const { list, studentList, grouped, pagination } = await kehadiranService.getKehadiranService({
      class_id: class_id as string,
      kelasId: kelasId as string,
      meeting: meeting as string,
      nomor: nomor as string,
      view: view as string,
      page: page as string,
      limit: limit as string,
      studentName,
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
      pagination,
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

    // Pemicu notifikasi kehadiran spesifik ke mahasiswa yang bersangkutan (tidak broadcast)
    try {
      const studentName = req.body.studentName || req.body.student_name || req.body.name || (newKhd as any)?.studentName || 'Mahasiswa';
      const rawStatus = (newKhd as any)?.status || req.body.status || 'Hadir';
      const status = rawStatus === 'Alpa' ? 'Alpha' : rawStatus;
      const matkul = (newKhd as any)?.namaMatkul || req.body.matkul_name || req.body.namaMatkul || 'Mata Kuliah';
      const meetingNum = req.body.nomor || (newKhd as any)?.nomor || 1;
      const pertemuan = `Pertemuan ${meetingNum}`;

      // Cari ID user mahasiswa berdasarkan nama/nim
      const targetUser = await prisma.user.findFirst({
        where: {
          role: 'mahasiswa',
          OR: [
            { name: { equals: studentName } },
            { nim: { equals: req.body.nim || '' } },
          ],
        },
        select: { id: true },
      });

      if (targetUser) {
        const recentNotif = await prisma.notification.findFirst({
          where: {
            userId: targetUser.id,
            type: 'kehadiran',
            createdAt: { gte: new Date(Date.now() - 15_000) },
          },
        });

        if (!recentNotif) {
          await createAndSendNotification({
            userId: targetUser.id,
            type: 'kehadiran',
            title: `Kehadiran Diperbarui: ${matkul}`,
            body: `Status kehadiran ${studentName} pada ${pertemuan} tercatat: ${status}.`,
            targetId: (newKhd as any)?.id || undefined,
            targetType: 'kehadiran',
            payload: {
              matkul,
              status,
              studentName,
              nomor: meetingNum,
            },
          });
        }
      } else {
        console.warn('[KEHADIRAN NOTIF]: targetUser not found for', studentName);
      }
    } catch (err) {
      console.error('[KEHADIRAN NOTIF ERROR]:', err);
    }

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
