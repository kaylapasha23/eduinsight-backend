import { Router } from 'express';
import userController from '../controllers/userController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuthMiddleware, userController.getAllUsers);          // Read All
router.get('/:id', optionalAuthMiddleware, userController.getUserById);      // Read by ID
router.post('/', authMiddleware, userController.createUser);           // Create
router.put('/:id', authMiddleware, userController.updateUser);        // Update
router.delete('/:id', authMiddleware, userController.deleteUser);     // Delete

export default router;