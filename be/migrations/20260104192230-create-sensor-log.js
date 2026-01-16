'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SensorLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lightValue: { type: Sequelize.INTEGER },
      lampStatus: { type: Sequelize.BOOLEAN },
      configId: {
        type: Sequelize.INTEGER,
        references: { model: 'SystemConfigs', key: 'id' }, // Manual Relation
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('SensorLogs'); }
};