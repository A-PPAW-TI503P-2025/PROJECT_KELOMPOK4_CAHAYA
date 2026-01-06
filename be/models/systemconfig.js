'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SystemConfig extends Model {
    static associate(models) {
      SystemConfig.belongsTo(models.User, { foreignKey: 'updatedBy' });
      SystemConfig.hasMany(models.SensorLog, { foreignKey: 'configId' });
    }
  };
  SystemConfig.init({
    threshold: { type: DataTypes.INTEGER, defaultValue: 2000 },
    manualMode: { type: DataTypes.BOOLEAN, defaultValue: false },
    lampStatus: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { sequelize, modelName: 'SystemConfig' });
  return SystemConfig;
};