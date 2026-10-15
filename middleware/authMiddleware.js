const jwt = require('jsonwebtoken');
const { isTokenBlacklisted, findUserById } = require('../data/database');

const JWT_SECRET = process.env.JWT_SECRET || 'eduinsight-super-secret-key-pbl-2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Autentikasi gagal: Token tidak disertakan atau format tidak valid (gunakan Bearer <token>).',
    });
  }

  const token = authHeader.split(' ')[1];

  // Cek apakah token sudah di-logout (blacklisted)
  if (isTokenBlacklisted(token)) {
    return res.status(401).json({
      success: false,
      message: 'Sesi telah berakhir: Token sudah tidak valid karena Anda telah logout. Silakan login kembali.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna yang terkait dengan token ini sudah tidak ditemukan.',
      });
    }

    // Attach user info (tanpa hash password) ke request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      nim: user.nim,
      nip: user.nip,
      fakultas: user.fakultas,
      prodi: user.prodi,
    };
    req.token = token;

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kadaluarsa. Silakan lakukan login ulang.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid atau telah dimanipulasi.',
    });
  }
}

module.exports = { authMiddleware, JWT_SECRET };
