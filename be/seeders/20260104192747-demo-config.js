'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('SystemConfigs', [{
      threshold: 2500,
      manualMode: false,
      updatedBy: 1, // Merujuk ke Admin (ID: 1)
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },
  down: async (queryInterface) => { await queryInterface.bulkDelete('SystemConfigs', null, {}); }
};