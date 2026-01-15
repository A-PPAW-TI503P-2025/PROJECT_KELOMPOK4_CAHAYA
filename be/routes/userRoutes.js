const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private (Admin only)
 */
router.get('/', authenticate, requireAdmin, userController.getAllUsers);

/**
 * @route   PATCH /api/users/:id
 * @desc    Update user
 * @access  Private (Admin only)
 */
router.patch('/:id', authenticate, requireAdmin, userController.updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticate, requireAdmin, userController.deleteUser);

module.exports = router;
