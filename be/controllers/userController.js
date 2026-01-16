const db = require('../models');
const { hashPassword } = require('../utils/passwordUtils');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

/**
 * Get all users (Admin only)
 * GET /api/users
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await db.User.findAll({
      attributes: ['id', 'username', 'role', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']]
    });

    return successResponse(res, { users }, 'Users retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Update user (Admin only)
 * PATCH /api/users/:id
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const user = await db.User.findByPk(id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Prevent admin from changing their own role
    if (user.id === req.user.id && role && role !== user.role) {
      return errorResponse(res, 'Cannot change your own role', 403);
    }

    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (password) {
      updateData.password = await hashPassword(password);
    }

    if (role) {
      updateData.role = role;
    }

    await user.update(updateData);

    return successResponse(res, {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, 'User updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 * DELETE /api/users/:id
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await db.User.findByPk(id);

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return errorResponse(res, 'Cannot delete your own account', 403);
    }

    await user.destroy();

    return successResponse(res, null, 'User deleted successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  updateUser,
  deleteUser
};
