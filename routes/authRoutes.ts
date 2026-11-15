import { Router, Request, Response } from 'express';
import authController from '../controllers/authController.js'; 

const router = Router();

// 1. Cek & pastikan fungsi controller tersedia agar tidak crash
const register = authController.register || ((req: Request, res: Response) => res.status(501).json({ message: 'Register belum diimplementasi' }));
const login = authController.login || ((req: Request, res: Response) => res.status(501).json({ message: 'Login belum diimplementasi' }));
const logout = authController.logout || ((req: Request, res: Response) => res.status(200).json({ success: true, message: 'Logout berhasil' }));
const resetPassword = authController.resetPassword || ((req: Request, res: Response) => res.status(501).json({ message: 'Reset Password belum diimplementasi' }));
const getProfile = authController.getProfile || ((req: Request, res: Response) => res.status(501).json({ message: 'Profile belum diimplementasi' }));

// 2. Routing Auth
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/reset-password', resetPassword);
router.get('/profile', getProfile);

export default router;