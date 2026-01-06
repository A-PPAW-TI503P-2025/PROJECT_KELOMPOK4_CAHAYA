const express = require('express');
const router = express.Router();
const webController = require('../controllers/webController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');
const { 
  validateConfigUpdate,
  handleValidationErrors 
} = require('../middleware/validationMiddleware');

/**
 * @route   GET /api/web/status
 * @desc    Get dashboard status (latest sensor data + config)
 * @access  Private
 */
router.get('/status', authenticate, webController.getDashboardStatus);

/**
 * @route   GET /api/web/logs
 * @desc    Get sensor logs with pagination
 * @access  Private
 * @query   page, limit, startDate, endDate
 */
router.get('/logs', authenticate, webController.getSensorLogs);

/**
 * @route   PATCH /api/web/config
 * @desc    Update system configuration
 * @access  Private (Admin only)
 */
router.patch(
  '/config',
  authenticate,
  requireAdmin,
  validateConfigUpdate,
  handleValidationErrors,
  webController.updateConfig
);

/**
 * @route   GET /api/web/statistics
 * @desc    Get statistics (lamp on/off, avg light value)
 * @access  Private
 * @query   period (24h, 7d, 30d)
 */
router.get('/statistics', authenticate, webController.getStatistics);

module.exports = router;
