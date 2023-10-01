const { DataTypes, Model } = require('sequelize');
const sequelize = require('../utils/pg');

const Token = sequelize.define('token', {
  token: { type: DataTypes.STRING, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false }
}, {
  sequelize,
  timestamps: false
});

module.exports = Token;
