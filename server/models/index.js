const Sequelize = require('sequelize');
const sequelize = require('../config/db'); // Ensure correct path to your db config

const models = {
  Book: require('./Book')(sequelize, Sequelize),
  User: require('./User')(sequelize), // Pass sequelize here, not Sequelize
  Order: require('./Order')(sequelize, Sequelize),
  OrderItem: require('./OrderItem')(sequelize, Sequelize),
  CartItem: require('./CartItem')(sequelize, Sequelize), // Add CartItem model
};

// Define associations
models.User.hasMany(models.Order, { foreignKey: 'userId' });
models.Order.belongsTo(models.User, { foreignKey: 'userId' });

models.Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
models.OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });

models.Book.hasMany(models.OrderItem, { foreignKey: 'bookId' });
models.OrderItem.belongsTo(models.Book, { foreignKey: 'bookId' });

// CartItem associations
models.User.hasMany(models.CartItem, { foreignKey: 'userId' });
models.CartItem.belongsTo(models.User, { foreignKey: 'userId' });

models.Book.hasMany(models.CartItem, { foreignKey: 'bookId' });
models.CartItem.belongsTo(models.Book, { foreignKey: 'bookId' });

module.exports = { sequelize, models };
