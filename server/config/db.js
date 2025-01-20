const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

sequelize
  .authenticate()
  .then(() => console.log('Database connection successful!'))
  .catch((error) => console.error('Unable to connect to the database:', error));

module.exports = sequelize;
