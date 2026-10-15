const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  findUserById,
  createUser,
  getUsers,
  blacklistToken,
} = require('../data/database');

const JWT_SECRET = process.env.JWT_SECRET || 'eduinsight-super-secret-key-pbl-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generate JWT Token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Strip sensitive fields from user object
 */
function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
async function register(req, res) {
  try {
    const { name, email, password, role, nim, nip, fakultas, prodi, angkatan } = req.body;

    // Validasi input wajib
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Registrasi gagal: Nama, email, dan password wajib diisi.',
      });
    }

    // Validasi panjang password minimal 6 karakter
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password minimal 6 karakter.',
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.',
      });
    }

    // Hash password dengan bcrypt (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat user baru
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: (role || 'mahasiswa').toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    // Tambahkan field opsional berdasarkan role
    if (newUser.role === 'mahasiswa') {
      newUser.nim = nim || '';
      newUser.angkatan = angkatan || '';
      newUser.fakultas = fakultas || 'Ilmu Komputer';
      newUser.prodi = prodi || 'Teknik Informatika';
    } else if (newUser.role === 'dosen') {
      newUser.nip = nip || '';
      newUser.fakultas = fakultas || 'Ilmu Komputer';
      newUser.prodi = prodi || 'Teknik Informatika';
    }

    createUser(newUser);

    // Generate JWT token
    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Selamat datang di EduInsight.',
      data: {
        user: sanitizeUser(newUser),
        token,
        tokenType: 'Bearer',
      },
    });
  } catch (error) {
    console.error('[REGISTER ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat registrasi.',
    });
  }
}

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Login gagal: Email dan password wajib diisi.',
      });
    }

    // Cari user berdasarkan email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login gagal: Email tidak terdaftar.',
      });
    }

    // Verifikasi password dengan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Login gagal: Password salah.',
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: `Login berhasil! Selamat datang, ${user.name}.`,
      data: {
        user: sanitizeUser(user),
        token,
        tokenType: 'Bearer',
      },
    });
  } catch (error) {
    console.error('[LOGIN ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat login.',
    });
  }
}

// ─────────────────────────────────────────
// POST /api/auth/logout (Protected)
// ─────────────────────────────────────────
function logout(req, res) {
  try {
    const token = req.token;

    // Masukkan token ke blacklist agar tidak bisa digunakan lagi
    blacklistToken(token);

    return res.status(200).json({
      success: true,
      message: 'Logout berhasil. Token telah direvokasi dan sesi dihapus.',
    });
  } catch (error) {
    console.error('[LOGOUT ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat logout.',
    });
  }
}

// ─────────────────────────────────────────
// GET /api/auth/profile (Protected)
// ─────────────────────────────────────────
function getProfile(req, res) {
  try {
    const user = findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Profil tidak ditemukan.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diambil.',
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error('[PROFILE ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat mengambil profil.',
    });
  }
}

// ─────────────────────────────────────────
// GET /api/auth/users (Admin Only)
// ─────────────────────────────────────────
function getAllUsers(req, res) {
  try {
    const users = getUsers();
    const safeUsers = users.map(sanitizeUser);

    return res.status(200).json({
      success: true,
      message: `Daftar semua pengguna (${safeUsers.length} user).`,
      data: {
        total: safeUsers.length,
        users: safeUsers,
      },
    });
  } catch (error) {
    console.error('[GET USERS ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat mengambil daftar pengguna.',
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
};
