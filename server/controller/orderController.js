const { models } = require('../models');
const Book = models.Book;
const CartItem = models.CartItem;


exports.placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch cart items for the user
    const cartItems = await CartItem.findAll({ where: { userId } });
    if (!cartItems.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total amount
    const totalAmount = await Promise.all(
      cartItems.map(async (item) => {
        const book = await Book.findByPk(item.bookId);
        return book.price * item.quantity; // Assuming `price` exists in Book model
      })
    ).then((amounts) => amounts.reduce((sum, curr) => sum + curr, 0));

    // Create Order
    const order = await Order.create({ userId, totalAmount });

    // Create OrderItems
    const orderItems = cartItems.map((item) => ({
      orderId: order.id,
      bookId: item.bookId,
      quantity: item.quantity,
    }));
    await OrderItem.bulkCreate(orderItems);

    // Clear the cart
    await CartItem.destroy({ where: { userId } });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
};

// Fetch cart items for the logged-in user
exports.getCartItems = async (req, res) => {
  const userId = req.params.id; // Retrieve userId from the route parameter

  // Validate that the userId is provided
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Fetch the cart items for the specified user
    const cartItems = await CartItem.findAll({
      where: { userId },  // Ensure the userId is properly passed in the query
      include: { model: Book, as: 'book' }, // Include related Book details
    });

    if (!cartItems.length) {
      return res.status(404).json({ message: 'No cart items found for this user' });
    }

    // Return the fetched cart items
    res.status(200).json(cartItems);
  } catch (error) {
    // Log and return an error response
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Error fetching cart items', error });
  }
};

// Update quantity of cart item
exports.updateCartItem = async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cartItem = await CartItem.findOne({ where: { userId, bookId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Error updating cart item', error });
  }
};

// Remove cart item
exports.removeCartItem = async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user.id;

  try {
    const cartItem = await CartItem.findOne({ where: { userId, bookId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartItem.destroy();

    res.status(200).json({ message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Error removing cart item', error });
  }
};


exports.addToCart = async (req, res) => {
  const { bookId, quantity } = req.body;
  const userId = req.user.id; // Assume user is authenticated
  
  try {
    // Check if book exists
    const book = await Book.findByPk(bookId);
;
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the book is already in the cart
    const existingCartItem = await CartItem.findOne({ where: { userId, bookId } });
    if (existingCartItem) {
      // Update quantity if the item is already in the cart
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // Add new item to the cart
      await CartItem.create({ userId, bookId, quantity });
    }

    res.status(200).json({ message: 'Book added to cart successfully' });
  } catch (error) {
    console.error('Error adding book to cart:', error);
    res.status(500).json({ message: 'Error adding book to cart', error });
  }
};


exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await models.Order.findAll({
      where: { userId },
      include: [{ model: models.OrderItem, include: [models.Book] }],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
};
