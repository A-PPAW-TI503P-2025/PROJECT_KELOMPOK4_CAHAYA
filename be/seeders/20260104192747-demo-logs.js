'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SensorLogs', [
      { lightValue: 1200, lampStatus: false, configId: 1, createdAt: new Date() },
      { lightValue: 2800, lampStatus: true, configId: 1, createdAt: new Date() },
      { lightValue: 3000, lampStatus: true, configId: 1, createdAt: new Date() }
    ], {});
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('SensorLogs', null, {}); }
};