module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      orderId: DataTypes.INTEGER,
      bookId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
    });
    return OrderItem;
  };
  