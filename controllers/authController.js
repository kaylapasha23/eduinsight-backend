const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  findUserByEmail,
  findUserById,
  createUser,
  getUsers,
  updateUserPassword,
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
  return res.status(403).json({
    success: false,
    message: 'Registrasi mandiri dinonaktifkan. Aplikasi EduInsight Mobile LMS dikhususkan untuk mahasiswa, dan akun dikelola/diinjeksi langsung oleh Bagian Akademik Kampus.',
  });
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
    let isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid && Array.isArray(user.additionalPasswordHashes)) {
      for (const altHash of user.additionalPasswordHashes) {
        if (await bcrypt.compare(password, altHash)) {
          isPasswordValid = true;
          break;
        }
      }
    }
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

// ─────────────────────────────────────────
// POST /api/auth/reset-password
// ─────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validasi input
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password baru wajib diisi.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Konfirmasi password tidak cocok dengan password baru.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal harus 6 karakter.',
      });
    }

    // Cari user berdasarkan email
    const user = findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email tidak ditemukan dalam sistem EduInsight.',
      });
    }

    // Hash password baru
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password di database
    const updatedUser = updateUserPassword(email, hashedPassword);
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui password pengguna.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password berhasil disetel ulang! Silakan masuk dengan password baru Anda.',
    });
  } catch (error) {
    console.error('[RESET PASSWORD ERROR]', error.message);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server saat menyetel ulang password.',
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  resetPassword,
};

