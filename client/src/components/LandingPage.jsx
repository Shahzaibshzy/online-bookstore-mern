import React, { useEffect, useState } from 'react';
import BookImage from '../assets/1.png';
import api from '../../services/api';
import { useCart } from '../contexts/CartContext';

const LandingPage = () => {
  const [books, setBooks] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get('/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center">Welcome to BookStore</h1>
      <p className="text-center">Explore our collection of amazing books!</p>
      <div className="row mt-4">
        {books.map((book) => (
          <div className="col-md-4" key={book.id}>
            <div className="card mb-3 shadow-sm">
              <img
                src={book.image || BookImage}
                alt={book.title}
                className="card-img-top"
                style={{ height: '300px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">{book.author}</p>
                <p className="card-text">
                  <strong>${book.price}</strong>
                </p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => addToCart(book)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LandingPage;
