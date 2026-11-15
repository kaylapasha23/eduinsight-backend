import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import {
  findUserByEmail,
  findUserById,
  getUsers,
  blacklistToken,
  updateUserPassword,
} from '../data/database.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'eduinsight-super-secret-key-pbl-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

function generateToken(user: any): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN as any }
  );
}

function sanitizeUser(user: any): any {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function register(req: Request, res: Response): Promise<Response> {
  return res.status(403).json({
    success: false,
    message: 'Registrasi mandiri dinonaktifkan. Silakan hubungi bagian akademik.',
  });
}

export async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi.',
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email tidak terdaftar.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Password salah.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login berhasil.',
      data: {
        user: sanitizeUser(user),
        token,
        tokenType: 'Bearer',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
}

export async function logout(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const token = req.token || '';
    await blacklistToken(token);

    return res.status(200).json({
      success: true,
      message: 'Logout berhasil.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
}

export async function getProfile(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak: Pengguna belum terautentikasi.',
      });
    }

    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Pengguna tidak ditemukan di sistem!',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profile OK',
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const users = await getUsers();
    const safeUsers = users.map(sanitizeUser);

    return res.status(200).json({
      success: true,
      message: 'Daftar pengguna berhasil dimuat.',
      data: {
        total: safeUsers.length,
        users: safeUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
}

export async function resetPassword(req: Request, res: Response): Promise<Response> {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password baru wajib diisi.',
      });
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Konfirmasi password tidak cocok.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password baru minimal 6 karakter.',
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email tidak terdaftar.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await updateUserPassword(email, hashedPassword);
    if (!updatedUser) {
      return res.status(500).json({
        success: false,
        message: 'Gagal memperbarui password.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Password berhasil diubah.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server.',
    });
  }
}

export default {
  register,
  login,
  logout,
  getProfile,
  getAllUsers,
  resetPassword,
};