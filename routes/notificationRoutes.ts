import { Router, Request, Response } from 'express';
import { prisma } from '../data/database.js';
import { optionalAuthMiddleware } from '../middleware/authMiddleware.js';
import { createAndSendNotification } from '../services/fcmService.js';

const router = Router();

// 1. Simpan atau perbarui FCM Token mahasiswa dari aplikasi Mobile
router.post('/fcm-token', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { token, userId, email } = req.body;
    const currentUserId = (req as any).user?.id || userId;

    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM Token diperlukan' });
    }

    if (currentUserId) {
      await prisma.user.update({
        where: { id: currentUserId },
        data: { fcmToken: token },
      });
    } else if (email) {
      await prisma.user.updateMany({
        where: { email: email.toLowerCase().trim() },
        data: { fcmToken: token },
      });
    } else {
      // Jika tidak ada user ID, pasangkan ke user mahasiswa pertama yang aktif
      const defaultStudent = await prisma.user.findFirst({
        where: { role: 'mahasiswa' },
      });
      if (defaultStudent) {
        await prisma.user.update({
          where: { id: defaultStudent.id },
          data: { fcmToken: token },
        });
      }
    }

    return res.status(200).json({ success: true, message: 'FCM token berhasil disimpan' });
  } catch (err: any) {
    console.error('Error saving FCM token:', err);
    return res.status(500).json({ success: false, error: err?.message || err });
  }
});

// 2. GET /api/notifications – Mengambil semua notifikasi mahasiswa
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.id;

    // Ambil dari tabel notifications
    const dbNotifs = await prisma.notification.findMany({
      where: currentUserId ? { OR: [{ userId: currentUserId }, { userId: null }] } : {},
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const unreadCount = dbNotifs.filter((n) => !n.isRead).length;

    const formatted = dbNotifs.map((n) => {
      let parsedPayload = null;
      if (n.payload) {
        try {
          parsedPayload = JSON.parse(n.payload);
        } catch (_) {}
      }

      return {
        id: n.id,
        type: n.type,
        title: n.title,
        body: n.body,
        targetId: n.targetId,
        targetType: n.targetType,
        payload: parsedPayload,
        isRead: n.isRead,
        createdAt: n.createdAt,
      };
    });

    return res.status(200).json({
      success: true,
      unreadCount,
      data: formatted,
    });
  } catch (err: any) {
    console.error('Error fetching notifications:', err);
    return res.status(500).json({ success: false, error: err?.message || err });
  }
});

// 3. PATCH /api/notifications/:id/read – Tandai notifikasi sudah dibaca
router.patch('/:id/read', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.notification.update({
      where: { id: String(id) },
      data: { isRead: true },
    });
    return res.status(200).json({ success: true, message: 'Notifikasi ditandai dibaca' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
});

// 4. POST /api/notifications/read-all – Tandai semua notifikasi sudah dibaca
router.post('/read-all', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const currentUserId = (req as any).user?.id;
    await prisma.notification.updateMany({
      where: currentUserId ? { OR: [{ userId: currentUserId }, { userId: null }] } : {},
      data: { isRead: true },
    });
    return res.status(200).json({ success: true, message: 'Semua notifikasi ditandai dibaca' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
});

// 5. POST /api/notifications/sync – Webhook manual jika dipanggil dari FE
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { type, title, body, targetId, targetType, payload, userId } = req.body;

    const notif = await createAndSendNotification({
      type: type || 'tugas',
      title: title || 'Pemberitahuan Baru',
      body: body || '',
      targetId,
      targetType,
      payload,
      userId,
    });

    return res.status(201).json({ success: true, data: notif });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || err });
  }
});

export default router;
