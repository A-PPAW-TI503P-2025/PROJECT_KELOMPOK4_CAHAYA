const db = require('../models');
const { hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateToken } = require('../utils/jwtUtils');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await db.User.findOne({ where: { username } });

    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // Return user data and token
    return successResponse(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, 'Login successful', 200);

  } catch (error) {
    next(error);
  }
};

/**
 * Register new user (Admin only)
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { username, password, role = 'user' } = req.body;

    // Check if username already exists
    const existingUser = await db.User.findOne({ where: { username } });

    if (existingUser) {
      return errorResponse(res, 'Username already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await db.User.create({
      username,
      password: hashedPassword,
      role
    });

    return successResponse(res, {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, 'User registered successfully', 201);

  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'role', 'createdAt']
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    return successResponse(res, { user }, 'Profile retrieved successfully');

  } catch (error) {
    next(error);
  }
};


/**
 * Public Signup (Force role = user)
 * POST /api/auth/signup
 */
const signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if username already exists
    const existingUser = await db.User.findOne({ where: { username } });

    if (existingUser) {
      return errorResponse(res, 'Username already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with forced role 'user'
    const user = await db.User.create({
      username,
      password: hashedPassword,
      role: 'user'
    });

    return successResponse(res, {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, 'Account created successfully', 201);

  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  register,
  signup,
  getProfile
};
