const { errorResponse } = require('../utils/responseFormatter');

/**
 * Require admin role
 * Must be used after authenticate middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required', 401);
  }

  if (req.user.role !== 'admin') {
    return errorResponse(res, 'Admin access required', 403);
  }

  next();
};

/**
 * Require any authenticated user
 * Alias for authenticate middleware for clarity
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 'Authentication required', 401);
  }
  next();
};

module.exports = {
  requireAdmin,
  requireAuth
};
