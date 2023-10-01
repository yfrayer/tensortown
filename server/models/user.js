const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../utils/pg');

const User = sequelize.define('user', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  regdate: DataTypes.DATE,
  active: { type: DataTypes.BOOLEAN, allowNull: false }
}, {
  sequelize,
  timestamps: false,
});

User.prototype.comparePassword = (plaintext) => {
  console.log('see middleware/passport');
};

User.beforeSave((user) => {
  if (user.changed('password')) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  }
});

module.exports = User;
