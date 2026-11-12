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

// Set Port ke 5001 agar tidak bentrok dengan frontend Next.js (port 3000)
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (aplikasi mobile/Postman)
      if (!origin) return callback(null, true);

      // Izinkan localhost / 127.0.0.1 di port mana pun (Flutter Web, Next.js)
      const isLocal = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
      if (isLocal) return callback(null, true);

      return callback(new Error('Origin tidak diizinkan oleh CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'EduInsight API is running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/kehadiran', kehadiranRoutes);
app.use('/api/penilaian', penilaianRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/evaluasi', evaluasiRoutes);
app.use('/api/password-setting', passwordSettingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan.',
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error.',
  });
});

async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('  🎓 EduInsight Backend API');
    console.log(`  🚀 Server running on http://localhost:${PORT}`);
    console.log('  📋 Endpoints Active');
    console.log('═══════════════════════════════════════════');
    console.log('');
  });
}

startServer();

module.exports = app;
