const db = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get current system configuration
 * GET /api/device/config
 * No authentication required - ESP32 needs to access this
 */
const getConfig = async (req, res, next) => {
  try {
    // Get the latest config (should only be one record)
    const config = await db.SystemConfig.findOne({
      order: [['updatedAt', 'DESC']],
      attributes: ['threshold', 'manualMode', 'lampStatus']
    });

    if (!config) {
      console.log('[DEBUG] Device requested config, but none found. Sending defaults.');
      // Return default values if no config exists
      return successResponse(res, {
        threshold: 2000,
        manualMode: false,
        lampStatus: false
      }, 'Default configuration');
    }

    console.log('[DEBUG] Sending Config to Device:', {
      threshold: config.threshold, 
      manualMode: config.manualMode,
      lampStatus: config.lampStatus
    });

    return successResponse(res, {
      threshold: config.threshold,
      manualMode: config.manualMode,
      lampStatus: config.lampStatus
    }, 'Configuration retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Post sensor log from ESP32
 * POST /api/device/log
 * No authentication required - ESP32 needs to access this
 */
const postSensorLog = async (req, res, next) => {
  try {
    const { lightValue, lampStatus } = req.body;
    
    console.log(`[DEBUG] Received Sensor Data -> Light: ${lightValue}, Lamp: ${lampStatus}`);

    // Get current config ID
    const config = await db.SystemConfig.findOne({
      order: [['updatedAt', 'DESC']]
    });

    // Create sensor log
    const log = await db.SensorLog.create({
      lightValue,
      lampStatus,
      configId: config ? config.id : null
    });

    return successResponse(res, {
      id: log.id,
      lightValue: log.lightValue,
      lampStatus: log.lampStatus,
      timestamp: log.createdAt
    }, 'Sensor log saved successfully', 201);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConfig,
  postSensorLog
};
