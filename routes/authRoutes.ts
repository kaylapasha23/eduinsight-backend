import { Router } from 'express';
import authController from '../controllers/authController.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { RegisterSchema, LoginSchema } from '../dtos/auth.dto.js';

const router = Router();

router.post('/register', validateBody(RegisterSchema), authController.register);
router.post('/login', validateBody(LoginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', authController.getProfile);

export default router;
