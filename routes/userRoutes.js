const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { authMiddleware, optionalAuthMiddleware } = require('../middleware/authMiddleware');

router.get('/', optionalAuthMiddleware, userController.getAllUsers);           // Read All
router.get('/:id', optionalAuthMiddleware, userController.getUserById);       // Read by ID
router.post('/', authMiddleware, userController.createUser);          // Create
router.put('/:id', authMiddleware, userController.updateUser);        // Update
router.delete('/:id', authMiddleware, userController.deleteUser);     // Delete

module.exports = router;
