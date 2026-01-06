const { body, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Validation rules for login
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Validation rules for user registration
 */
const validateRegister = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'user'])
    .withMessage('Role must be either admin or user')
];

/**
 * Validation rules for sensor log from ESP32
 */
const validateSensorLog = [
  body('lightValue')
    .isInt({ min: 0 })
    .withMessage('Light value must be a positive integer'),
  body('lampStatus')
    .isBoolean()
    .withMessage('Lamp status must be a boolean')
];

/**
 * Validation rules for config update
 */
const validateConfigUpdate = [
  body('threshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Threshold must be a positive integer'),
  body('manualMode')
    .optional()
    .isBoolean()
    .withMessage('Manual mode must be a boolean')
];

/**
 * Handle validation errors
 * Must be used after validation rules
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return errorResponse(res, 'Validation failed', 400, errorMessages);
  }
  
  next();
};

module.exports = {
  validateLogin,
  validateRegister,
  validateSensorLog,
  validateConfigUpdate,
  handleValidationErrors
};
