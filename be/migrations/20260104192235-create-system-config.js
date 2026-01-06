'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SystemConfigs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      threshold: { type: Sequelize.INTEGER, defaultValue: 2000 },
      manualMode: { type: Sequelize.BOOLEAN, defaultValue: false },
      updatedBy: {
        type: Sequelize.INTEGER,
        references: { model: 'Users', key: 'id' }, // Manual Relation
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface) => { await queryInterface.dropTable('SystemConfigs'); }
};