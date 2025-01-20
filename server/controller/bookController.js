const { models } = require('../models');
const Book = models.Book;

// Admin: Add a new book
const addBook = async (req, res) => {
  const { title, author, price, category, availability } = req.body;

  try {
    // Check if the user is authorized (this is redundant if the middleware already checks, but acts as a safeguard)


    const book = await Book.create({ title, author, price, category, availability });
    return res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding book', error });
  }
};

// Customer and Admin: View all books
const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    return res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error); // This will give you more details in the server logs
    return res.status(500).json({
      message: 'Error fetching books',
      error: error.message || error, // Send the actual error message in the response
    });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the book by primary key (ID)
    const book = await Book.findByPk(id);

    // If the book is not found, return a 404 response
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // If the book is found, return it
    return res.status(200).json(book);
  } catch (error) {
    // Handle any errors
    return res.status(500).json({
      message: 'Error fetching book by ID',
      error: error.message || error,
    });
  }
};

// Admin: Update a book
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, price, category, availability } = req.body;

  try {
    // Check if the user is authorized

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.update({ title, author, price, category, availability });
    return res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating book', error });
  }
};

// Admin: Delete a book
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the user is authorized

    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    await book.destroy();
    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting book', error });
  }
};

module.exports = { addBook, getBooks, updateBook, deleteBook , getBookById };
