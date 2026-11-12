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
const noteRoutes = require('./routes/noteRoutes');

const app = express();

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

app.get('/', (req, res) => {
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
app.use('/api/password-setting', passwordSettingsRoutes);
app.use('/api/notes', noteRoutes);

// Fallback 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} tidak ditemukan.`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
    error: err.message,
  });
});

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════');
      console.log('  🎓 EduInsight Backend API');
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

module.exports = app;
