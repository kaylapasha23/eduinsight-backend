import { initializeApp, cert, App } from 'firebase-admin/app';
import { getMessaging, MulticastMessage } from 'firebase-admin/messaging';
import path from 'path';
import fs from 'fs';
import { prisma } from '../data/database.js';

let firebaseApp: App | null = null;

try {
  const envJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
  const serviceAccountPath = path.join(process.cwd(), 'firebase-admin.json');

  if (envJson) {
    const serviceAccount = JSON.parse(envJson);
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('[FCM] Firebase Admin SDK initialized from FIREBASE_SERVICE_ACCOUNT_JSON');
  } else if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    firebaseApp = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('[FCM] Firebase Admin SDK initialized successfully');
  } else {
    console.warn('[FCM] firebase-admin.json / FIREBASE_SERVICE_ACCOUNT_JSON not found, push notifications will be simulated');
  }
} catch (err: any) {
  console.error('[FCM] Error initializing Firebase Admin:', err?.message || err);
}

export interface SendPushParams {
  userId?: string | null;
  type: 'tugas' | 'kehadiran' | 'penilaian' | 'evaluasi';
  title: string;
  body: string;
  targetId?: string;
  targetType?: string;
  payload?: any;
}

export async function createAndSendNotification(params: SendPushParams) {
  try {
    // 1. Simpan ke database notifications
    const newNotif = await prisma.notification.create({
      data: {
        userId: params.userId || null,
        type: params.type,
        title: params.title,
        body: params.body,
        targetId: params.targetId || null,
        targetType: params.targetType || params.type,
        payload: params.payload ? JSON.stringify(params.payload) : null,
        isRead: false,
      },
    });

    // 2. Ambil token FCM mahasiswa
    let tokens: string[] = [];
    if (params.userId) {
      const user = await prisma.user.findUnique({
        where: { id: params.userId },
        select: { fcmToken: true },
      });
      if (user?.fcmToken) {
        tokens.push(user.fcmToken);
      }
    } else {
      // Notifikasi broadcast untuk semua mahasiswa yang punya token
      const users = await prisma.user.findMany({
        where: {
          role: 'mahasiswa',
          fcmToken: { not: null },
        },
        select: { fcmToken: true },
      });
      tokens = users.map((u) => u.fcmToken!).filter(Boolean);
    }

    // 3. Kirim push notification ke perangkat via FCM (High Priority agar tembus Doze mode Android saat app ditutup)
    if (firebaseApp && tokens.length > 0) {
      const message: MulticastMessage = {
        notification: {
          title: params.title,
          body: params.body,
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'eduinsight_channel',
            sound: 'default',
            priority: 'high',
            defaultVibrateTimings: true,
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
        data: {
          notifId: newNotif.id,
          type: params.type,
          targetId: params.targetId || '',
          targetType: params.targetType || params.type,
          payload: params.payload ? JSON.stringify(params.payload) : '',
        },
        tokens,
      };

      const messaging = getMessaging(firebaseApp);
      const response = await messaging.sendEachForMulticast(message);
      console.log(`[FCM] Notification sent to ${response.successCount}/${tokens.length} devices`);
    } else {
      console.log(`[FCM] Notification saved in DB (${newNotif.id}): "${params.title}"`);
    }

    return newNotif;
  } catch (err: any) {
    console.error('[FCM] Error createAndSendNotification:', err);
    throw err;
  }
}
