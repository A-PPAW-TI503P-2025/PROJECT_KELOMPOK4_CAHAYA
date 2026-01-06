const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { 
  validateSensorLog,
  handleValidationErrors 
} = require('../middleware/validationMiddleware');

/**
 * @route   GET /api/device/config
 * @desc    Get current system configuration for ESP32
 * @access  Public (No auth - ESP32 needs access)
 */
router.get('/config', deviceController.getConfig);

/**
 * @route   POST /api/device/log
 * @desc    Post sensor data from ESP32
 * @access  Public (No auth - ESP32 needs access)
 */
router.post(
  '/log',
  validateSensorLog,
  handleValidationErrors,
  deviceController.postSensorLog
);

module.exports = router;
