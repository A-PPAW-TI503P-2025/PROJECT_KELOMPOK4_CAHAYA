'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SensorLog extends Model {
    static associate(models) {
      SensorLog.belongsTo(models.SystemConfig, { foreignKey: 'configId' });
    }
  };
  SensorLog.init({
    lightValue: DataTypes.INTEGER,
    lampStatus: DataTypes.BOOLEAN
  }, { sequelize, modelName: 'SensorLog', updatedAt: false });
  return SensorLog;
};