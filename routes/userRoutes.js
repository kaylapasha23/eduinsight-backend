const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, userController.getAllUsers);           // Read All
router.get('/:id', authMiddleware, userController.getUserById);       // Read by ID
router.post('/', authMiddleware, userController.createUser);          // Create
router.put('/:id', authMiddleware, userController.updateUser);        // Update
router.delete('/:id', authMiddleware, userController.deleteUser);     // Delete

module.exports = router;