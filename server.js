require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./data/database');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const classRoutes = require('./routes/classRoutes');
const kehadiranRoutes = require('./routes/kehadiranRoutes');
const penilaianRoutes = require('./routes/penilaianRoutes');
const tugasRoutes = require('./routes/tugasRoutes');
const evaluasiRoutes = require('./routes/evaluasiRoutes');
const passwordSettingsRoutes = require('./routes/passwordSettingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ═══════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════

// CORS — Allow all origins (dev mode, Flutter web/emulator)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ═══════════════════════════════════════════
// INITIALIZE DATABASE
// ═══════════════════════════════════════════
initDatabase();

// ═══════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════

// Health Check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎓 EduInsight Backend API berjalan dengan baik!',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      resetPassword: 'POST /api/auth/reset-password',
      logout: 'POST /api/auth/logout',
      profile: 'GET /api/auth/profile',
      users: 'GET /api/auth/users (admin only)',
      dashboardMahasiswa: 'GET /api/auth/dashboard/mahasiswa',
      dashboardDosen: 'GET /api/auth/dashboard/dosen',
      dashboardAdmin: 'GET /api/auth/dashboard/admin',
    },
    dummyAccounts: [
      { role: 'mahasiswa', email: 'mahasiswa@eduinsight.ac.id', password: 'password123' },
      { role: 'dosen', email: 'dosen@eduinsight.ac.id', password: 'password123' },
      { role: 'admin', email: 'admin@eduinsight.ac.id', password: 'admin123' },
    ],
  });
});

// Mount auth & users routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/kehadiran', kehadiranRoutes);
app.use('/api/penilaian', penilaianRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/evaluasi', evaluasiRoutes);
app.use('/api/password-setting', passwordSettingsRoutes);

// ═══════════════════════════════════════════
// 404 HANDLER
// ═══════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint tidak ditemukan: ${req.method} ${req.originalUrl}`,
    hint: 'Cek kembali URL dan method HTTP yang digunakan. Kunjungi GET / untuk melihat daftar endpoint.',
  });
});

// ═══════════════════════════════════════════
// ERROR HANDLER
// ═══════════════════════════════════════════
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error.',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

// ═══════════════════════════════════════════
// START SERVER
// ═══════════════════════════════════════════
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('  🎓 EduInsight Backend API');
  console.log(`  🚀 Server running on http://localhost:${PORT}`);
  console.log('  📋 Endpoints:');
  console.log(`     POST   /api/auth/register`);
  console.log(`     POST   /api/auth/login
     POST   /api/auth/reset-password`);
  console.log(`     POST   /api/auth/logout`);
  console.log(`     GET    /api/auth/profile`);
  console.log(`     GET    /api/auth/users (admin)`);
  console.log('  👥 Dummy Accounts:');
  console.log('     mahasiswa@eduinsight.ac.id / password123');
  console.log('     brookeverly17@eduinsight.student.ac.id / password123 (Brooke Everly)');
  console.log('     redchris@gmail.com / password123 (Chris Redfield)');
  console.log('     dosen@eduinsight.ac.id     / password123');
  console.log('     admin@eduinsight.ac.id     / admin123');
  console.log('═══════════════════════════════════════════');
  console.log('');
});

module.exports = app;
