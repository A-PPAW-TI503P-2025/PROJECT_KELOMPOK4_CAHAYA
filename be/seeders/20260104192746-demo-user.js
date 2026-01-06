'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash passwords
    const hashedAdminPassword = await bcrypt.hash('password123', 10);
    const hashedUserPassword = await bcrypt.hash('user123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin_cahaya',
        password: hashedAdminPassword,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'user_biasa',
        password: hashedUserPassword,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('Users', null, {}); }
};