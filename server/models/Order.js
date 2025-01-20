module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      userId: DataTypes.INTEGER,
      totalAmount: DataTypes.FLOAT,
    });
    return Order;
  };
  