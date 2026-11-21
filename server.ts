import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { initDatabase } from './data/database.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import classRoutes from './routes/classRoutes.js';
import kehadiranRoutes from './routes/kehadiranRoutes.js';
import penilaianRoutes from './routes/penilaianRoutes.js';
import tugasRoutes from './routes/tugasRoutes.js';
import evaluasiRoutes from './routes/evaluasiRoutes.js';
import passwordSettingRoutes from './routes/passwordSettingRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import nilaiSemesterRoutes from './routes/nilaiSemesterRoutes.js';
import evaluatorRoutes from './routes/evaluatorRoutes.js';
import pengumpulanTugasRoutes from './routes/pengumpulanTugasRoutes.js';

const app = express();

// Request logging – harus dipasang sebelum semua route
import requestLogger from './middleware/loggingMiddleware.js';
app.use(requestLogger);
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Izinkan localhost port berapapun (Flutter Web, Next.js web)
      const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocal) return callback(null, true);

      return callback(new Error('Origin tidak diizinkan oleh CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Expose folder /uploads sebagai static folder
const uploadsPath = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'EduInsight API is running on MySQL (eduinsight_db)',
    timestamp: new Date().toISOString(),
  });
});

// Daftarkan semua route
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/kehadiran', kehadiranRoutes);
app.use('/api/penilaian', penilaianRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/evaluasi', evaluasiRoutes);
app.use('/api/password-setting', passwordSettingRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/nilai-semester', nilaiSemesterRoutes);
app.use('/api/evaluator', evaluatorRoutes);
app.use('/api/pengumpulan-tugas', pengumpulanTugasRoutes);

// Fallback 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[SERVER ERROR]:', err?.stack || err);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: err?.message || err,
  });
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('  🎓 EduInsight Backend API (TypeScript)');
      console.log(`  🚀 Server running on http://localhost:${PORT}`);
      console.log('  🗄️ Database: MySQL XAMPP (eduinsight_db)');
      console.log('  📋 All Routes Integrated & Ready');
      console.log('═══════════════════════════════════════════');
      console.log('');
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error);
  }
}

startServer();

export default app;