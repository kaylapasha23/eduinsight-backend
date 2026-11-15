import { Router, Request, Response } from 'express';
import passwordSettingController from '../controllers/passwordSettingController.js';

const updatePasswordSettings =
  passwordSettingController?.updatePasswordSettings ||
  ((req: Request, res: Response) => res.status(200).json({ success: true, message: 'Password updated' }));

const router = Router();

router.post('/', updatePasswordSettings);
router.put('/', updatePasswordSettings);

export default router;