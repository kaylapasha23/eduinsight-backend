import { Router, Request, Response } from 'express';
import { MASTER_NILAI_SEMESTER } from '../data/database.js';

const router = Router();

// GET /api/nilai-semester
router.get('/', (req: Request, res: Response): Response => {
  return res.status(200).json({
    success: true,
    data: MASTER_NILAI_SEMESTER,
  });
});

export default router;