import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as jwt_decode from 'jwt-decode';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]); // Ensure it's always an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // For error feedback

  useEffect(() => {
    // Function to get userId from the JWT token stored in localStorage
    const getUserIdFromToken = () => {
      const token = localStorage.getItem('authToken'); // Assuming your token is stored in localStorage
      if (!token) return null;

      try {
        const decodedToken = jwt_decode(token); // Decode the JWT token
        return decodedToken.userId; // Assuming the token contains userId
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    };

    const userId = getUserIdFromToken(); // Get userId from token

    if (!userId) {
      setError('User is not logged in');
      setLoading(false);
      return;
    }

    const fetchCartItems = async () => {
      console.log('Fetching cart items for userId:', userId);

      try {
        const response = await axios.get(`/orders/${userId}`);
        console.log('Response data:', response.data);  // Log the response

        setCartItems(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setError('Error fetching cart items. Please try again later.');
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []); // Empty dependency array to run the effect once on component mount

  const handleQuantityChange = async (bookId, quantity) => {
    try {
      await axios.put(`/orders/cart/${bookId}`, { bookId, quantity });
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.bookId === bookId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      setError('Error updating quantity. Please try again later.');
    }
  };

  const handleRemoveItem = async (bookId) => {
    try {
      await axios.delete(`/orders/cart/${bookId}`);
      setCartItems((prevItems) => prevItems.filter((item) => item.bookId !== bookId));
    } catch (error) {
      console.error('Error removing item:', error);
      setError('Error removing item. Please try again later.');
    }
  };

  const getTotalPrice = () => {
    // Ensure cartItems is an array before using reduce
    if (Array.isArray(cartItems)) {
      return cartItems.reduce((total, item) => total + item.quantity * item.book.price, 0);
    }
    return 0;
  };

  return (
    <div className="container my-5">
      <h1 className="text-center">Your Cart</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="row">
              {cartItems.map((cartItem) => (
                <div className="col-md-4" key={cartItem.book.id}>
                  <div className="card mb-3">
                    <img
                      src={cartItem.book.image || '/path/to/default-image.jpg'}
                      alt={cartItem.book.title}
                      className="card-img-top"
                      style={{ height: '300px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{cartItem.book.title}</h5>
                      <p className="card-text">{cartItem.book.author}</p>
                      <p className="card-text">
                        <strong>${cartItem.book.price}</strong>
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              handleQuantityChange(cartItem.book.id, cartItem.quantity - 1)
                            }
                            disabled={cartItem.quantity === 1}
                          >
                            -
                          </button>
                          <span className="mx-2">{cartItem.quantity}</span>
                          <button
                            className="btn btn-secondary"
                            onClick={() =>
                              handleQuantityChange(cartItem.book.id, cartItem.quantity + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemoveItem(cartItem.book.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="d-flex justify-content-end">
            <h4>Total: ${getTotalPrice().toFixed(2)}</h4>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button className="btn btn-success">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
