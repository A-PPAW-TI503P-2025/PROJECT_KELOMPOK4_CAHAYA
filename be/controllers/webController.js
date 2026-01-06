const db = require('../models');
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const { Op } = require('sequelize');

/**
 * Get dashboard status (latest sensor data + current config)
 * GET /api/web/status
 */
const getDashboardStatus = async (req, res, next) => {
  try {
    // Get latest sensor log
    const latestLog = await db.SensorLog.findOne({
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'lightValue', 'lampStatus', 'createdAt']
    });

    // Get current config
    const config = await db.SystemConfig.findOne({
      order: [['updatedAt', 'DESC']],
      attributes: ['id', 'threshold', 'manualMode', 'lampStatus', 'updatedAt'],
      include: [{
        model: db.User,
        attributes: ['username'],
        required: false
      }]
    });

    return successResponse(res, {
      latestSensorData: latestLog || null,
      currentConfig: config || { threshold: 2000, manualMode: false, lampStatus: false }
    }, 'Dashboard status retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get sensor logs with pagination and filters
 * GET /api/web/logs?page=1&limit=50&startDate=&endDate=
 */
const getSensorLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    // Build where clause for filters
    const where = {};
    
    if (req.query.startDate) {
      where.createdAt = { [Op.gte]: new Date(req.query.startDate) };
    }
    
    if (req.query.endDate) {
      where.createdAt = { 
        ...where.createdAt,
        [Op.lte]: new Date(req.query.endDate) 
      };
    }

    // Get logs with pagination
    const { count, rows } = await db.SensorLog.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      attributes: ['id', 'lightValue', 'lampStatus', 'createdAt']
    });

    return successResponse(res, {
      logs: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Sensor logs retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Update system configuration (Admin only)
 * PATCH /api/web/config
 */
const updateConfig = async (req, res, next) => {
  try {
    const { threshold, manualMode, lampStatus } = req.body;

    console.log('[DEBUG] Receive Update Config:', { threshold, manualMode, lampStatus });

    // Get current config
    let config = await db.SystemConfig.findOne({
      order: [['updatedAt', 'DESC']]
    });

    const updateData = {
      updatedBy: req.user.id
    };

    if (threshold !== undefined) updateData.threshold = threshold;
    if (manualMode !== undefined) updateData.manualMode = manualMode;
    if (lampStatus !== undefined) updateData.lampStatus = lampStatus;

    if (config) {
      await config.update(updateData);
    } else {
      config = await db.SystemConfig.create({
        threshold: threshold || 2000,
        manualMode: manualMode || false,
        lampStatus: lampStatus || false,
        updatedBy: req.user.id
      });
    }

    // Reload with user info
    await config.reload({
      include: [{
        model: db.User,
        attributes: ['username']
      }]
    });
    
    console.log('[DEBUG] Config Updated:', config.toJSON());

    return successResponse(res, {
      config: {
        id: config.id,
        threshold: config.threshold,
        manualMode: config.manualMode,
        lampStatus: config.lampStatus,
        updatedBy: config.User ? config.User.username : null,
        updatedAt: config.updatedAt
      }
    }, 'Configuration updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get statistics (lamp on/off count, average light value, etc.)
 * GET /api/web/statistics?period=24h
 */
const getStatistics = async (req, res, next) => {
  try {
    const period = req.query.period || '24h'; // 24h, 7d, 30d
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch(period) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      default:
        startDate.setHours(now.getHours() - 24);
    }

    // Get logs in period (with timestamps for chart)
    const logs = await db.SensorLog.findAll({
      where: {
        createdAt: { [Op.gte]: startDate }
      },
      attributes: ['lightValue', 'lampStatus', 'createdAt'],
      order: [['createdAt', 'ASC']]
    });

    // Calculate statistics
    const totalLogs = logs.length;
    const lampOnCount = logs.filter(log => log.lampStatus === true).length;
    const lampOffCount = totalLogs - lampOnCount;
    
    const avgLightValue = totalLogs > 0
      ? logs.reduce((sum, log) => sum + log.lightValue, 0) / totalLogs
      : 0;

    const maxLightValue = totalLogs > 0
      ? Math.max(...logs.map(log => log.lightValue))
      : 0;

    const minLightValue = totalLogs > 0
      ? Math.min(...logs.map(log => log.lightValue))
      : 0;

    // Prepare chart data (sample every nth point for performance)
    const chartData = logs.map(log => ({
      time: log.createdAt,
      value: log.lightValue,
      lamp: log.lampStatus ? 1 : 0
    }));

    return successResponse(res, {
      period,
      statistics: {
        totalLogs,
        lampOnCount,
        lampOffCount,
        lampOnPercentage: totalLogs > 0 ? ((lampOnCount / totalLogs) * 100).toFixed(2) : 0,
        avgLightValue: Math.round(avgLightValue),
        maxLightValue,
        minLightValue
      },
      chartData
    }, 'Statistics retrieved successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStatus,
  getSensorLogs,
  updateConfig,
  getStatistics
};
