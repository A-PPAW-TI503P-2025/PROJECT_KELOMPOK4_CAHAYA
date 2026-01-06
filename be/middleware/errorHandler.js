const { errorResponse } = require('../utils/responseFormatter');

/**
 * Global error handling middleware
 * Catches all errors and sends formatted response
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return errorResponse(res, 'Validation error', 400, errors);
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'Duplicate entry. This record already exists.', 409);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return errorResponse(res, message, statusCode);
};

module.exports = errorHandler;
