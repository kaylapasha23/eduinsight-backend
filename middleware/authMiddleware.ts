import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { isTokenBlacklisted, findUserById } from '../data/database.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'eduinsight-super-secret-key-pbl-2026';

// Memperluas tipe Request Express agar mengenali properti .user dan .token
export interface AuthenticatedRequest extends Request {
  user?: {
    id: any;
    name?: string;
    email?: string;
    role?: string;
    nim?: string;
    nip?: string;
    fakultas?: string;
    prodi?: string;
    [key: string]: any;
  };
  token?: string;
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Akses ditolak: Token tidak valid.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Sesi telah berakhir. Silakan login kembali.',
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: any };
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Pengguna tidak ditemukan.',
      });
    }

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

    return next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kedaluwarsa.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid.',
    });
  }
}

export async function optionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id: any };
    const user = await findUserById(decoded.id);
    if (user) {
      req.user = user;
      req.token = token;
    }
  } catch (e) {
    // Ignore invalid token for optional auth
  }
  return next();
}