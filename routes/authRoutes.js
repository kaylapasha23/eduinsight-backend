const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  resetPassword,
} = require('../controllers/authController');

const { authMiddleware } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

// ═══════════════════════════════════════════
// PUBLIC ROUTES (Tanpa autentikasi)
// ═══════════════════════════════════════════

// POST /api/auth/register — Pendaftaran pengguna baru
router.post('/register', register);

// POST /api/auth/login — Login pengguna
router.post('/login', login);

// POST /api/auth/reset-password — Lupa password / setel ulang password
router.post('/reset-password', resetPassword);
router.post('/forgot-password', resetPassword);

// ═══════════════════════════════════════════
// PROTECTED ROUTES (Wajib login / Bearer token)
// ═══════════════════════════════════════════

// POST /api/auth/logout — Logout + revokasi token
router.post('/logout', authMiddleware, logout);

// GET /api/auth/profile — Ambil profil user yang sedang login
router.get('/profile', authMiddleware, getProfile);

// ═══════════════════════════════════════════
// ADMIN-ONLY ROUTES (Wajib login + role admin)
// ═══════════════════════════════════════════

// GET /api/auth/users — Lihat semua pengguna terdaftar
router.get('/users', authMiddleware, roleMiddleware('admin'), getAllUsers);

// ═══════════════════════════════════════════
// ROLE-SPECIFIC DEMO ROUTES
// ═══════════════════════════════════════════

// GET /api/auth/dashboard/mahasiswa — Demo endpoint hanya untuk mahasiswa
router.get(
  '/dashboard/mahasiswa',
  authMiddleware,
  roleMiddleware('mahasiswa'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: `Selamat datang di Dashboard Mahasiswa, ${req.user.name}!`,
      data: {
        role: req.user.role,
        features: [
          'Lihat IPK & Nilai',
          'Lihat Jadwal Kelas',
          'Kumpulkan Tugas',
          'Lihat Kehadiran',
          'Evaluasi AI',
        ],
      },
    });
  }
);

// GET /api/auth/dashboard/dosen — Demo endpoint hanya untuk dosen
router.get(
  '/dashboard/dosen',
  authMiddleware,
  roleMiddleware('dosen'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: `Selamat datang di Dashboard Dosen, ${req.user.name}!`,
      data: {
        role: req.user.role,
        features: [
          'Kelola Kelas',
          'Buat Tugas',
          'Input Nilai',
          'Rekap Kehadiran',
          'Beri Catatan Evaluasi',
        ],
      },
    });
  }
);

// GET /api/auth/dashboard/admin — Demo endpoint hanya untuk admin
router.get(
  '/dashboard/admin',
  authMiddleware,
  roleMiddleware('admin'),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: `Selamat datang di Panel Admin, ${req.user.name}!`,
      data: {
        role: req.user.role,
        features: [
          'Manajemen Pengguna',
          'Manajemen Kelas',
          'Laporan Akademik',
          'Konfigurasi Sistem',
        ],
      },
    });
  }
);

module.exports = router;
