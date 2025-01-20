const express = require('express');
const { placeOrder, getOrderHistory , addToCart , removeCartItem , updateCartItem , getCartItems} = require('../controller/orderController');
const router = express.Router();

router.post('/', placeOrder);
router.post('/cart', addToCart);       // Place a new order
router.get('/:userId', getOrderHistory); // Get order history for a user
router.get('/:id', getCartItems); // Get order history for a user
router.delete('/cart/:id', removeCartItem); // Get order history for a user
router.put('/cart/:id', updateCartItem); // Get order history for a user

module.exports = router;
