const { verifyToken } = require('../utils/jwtUtils');
const { errorResponse } = require('../utils/responseFormatter');

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 * Attaches user data to req.user
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'No token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

module.exports = {
  authenticate
};
