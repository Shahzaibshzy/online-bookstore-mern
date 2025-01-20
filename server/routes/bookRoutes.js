const express = require('express');
const { addBook, getBooks, updateBook, deleteBook, getBookById } = require('../controller/bookController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes with authentication and role-based access control
router.get('/',  getBooks); // Accessible to all authenticated users (customers and admins)
router.get('/:id',  getBookById); // Accessible to all authenticated users (customers and admins)

router.post('/', addBook); // Admin only
router.put('/:id', updateBook); // Admin only
router.delete('/:id', deleteBook); // Admin only

module.exports = router;
