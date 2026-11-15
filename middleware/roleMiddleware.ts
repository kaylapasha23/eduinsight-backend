import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware.js';

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 * @param {...string} allowedRoles Daftar role yang diizinkan mengakses endpoint
 */
export function roleMiddleware(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak: Pengguna belum terautentikasi.',
      });
    }

    const userRole = req.user.role ? req.user.role.toLowerCase() : '';
    const normalizedAllowed = allowedRoles.map((r) => r.toLowerCase());

    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        status: 403,
        error: 'Forbidden',
        message: `Akses Ditolak: Peran Anda [${userRole.toUpperCase()}] tidak memiliki hak akses ke endpoint ini. Fitur ini hanya diperuntukkan bagi peran: [${allowedRoles.join(', ').toUpperCase()}].`,
        userRole: userRole,
        requiredRoles: allowedRoles,
      });
    }

    return next();
  };
}