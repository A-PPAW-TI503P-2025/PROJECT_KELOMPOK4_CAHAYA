const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { 
  validateLogin, 
  validateRegister,
  handleValidationErrors 
} = require('../middleware/validationMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post(
  '/login',
  validateLogin,
  handleValidationErrors,
  authController.login
);

/**
 * @route   POST /api/auth/signup
 * @desc    Register new user (Public)
 * @access  Public
 */
router.post(
  '/signup',
  validateRegister,
  handleValidationErrors,
  authController.signup
);

/**
 * @route   POST /api/auth/register
 * @desc    Register new user (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/register',
  authenticate,
  requireAdmin,
  validateRegister,
  handleValidationErrors,
  authController.register
);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/profile',
  authenticate,
  authController.getProfile
);

module.exports = router;
