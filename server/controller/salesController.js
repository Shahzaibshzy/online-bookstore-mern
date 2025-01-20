const { sequelize } = require('../models'); // Import sequelize

exports.getSalesOverview = async (req, res) => {
  try {
    const salesOverview = await sequelize.query(
      `
      SELECT 
        DATE_TRUNC('day', "Order"."createdAt") AS "period",
        SUM("OrderItem"."quantity" * "Book"."price") AS "totalSales",
        SUM("OrderItem"."quantity") AS "totalQuantitySold",
        "Book"."id" AS "BookId",
        "Book"."title" AS "BookTitle"
      FROM "OrderItems" AS "OrderItem"
      LEFT OUTER JOIN "Orders" AS "Order" ON "OrderItem"."orderId" = "Order"."id"
      LEFT OUTER JOIN "Books" AS "Book" ON "OrderItem"."bookId" = "Book"."id"
      GROUP BY "period", "Book"."id", "Book"."title"
      ORDER BY "period" ASC;
      `,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json(salesOverview);
  } catch (error) {
    console.log('Error fetching sales overview:', error);
    res.status(500).json({ message: 'Error fetching sales overview', error });
  }
};
