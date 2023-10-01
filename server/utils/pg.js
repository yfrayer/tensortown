const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASS, {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;
