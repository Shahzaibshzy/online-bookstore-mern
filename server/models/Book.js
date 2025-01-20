// models/Book.js
module.exports = (sequelize, Sequelize) => {
  const Book = sequelize.define('Book', {
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    category: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    availability: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
  });

  return Book;
};
