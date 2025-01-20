import React, { useState, useEffect } from "react";
import api from "../../services/api";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(1); // For the number selection
  const [userIds, setUserIds] = useState([]);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [bookData, setBookData] = useState({
    id: null,
    title: "",
    author: "",
    price: "",
    category: "",
    availability: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }); // Data for the book


  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError("");
        if (activeTab === "books") {
          const response = await api.get("/books");
          setBooks(response.data);
        } else if (activeTab === "orders") {
          const response = await api.get(`/orders/${selectedNumber}`); // Pass selectedNumber as part of the URL
          setOrders(response.data);
        } else if (activeTab === "sales") {
          const response = await api.get(
            `/sales/overview?period=${selectedPeriod}`
          );
          setSales(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [activeTab, selectedNumber]); // Add selectedNumber to the dependency array

  useEffect(() => {
    const fetchUserIds = async () => {
      try {
        const response = await api.get("/users"); // Fetch user data from /users
        const ids = response.data.users.map((user) => user.id); // Access users array and map ids
        setUserIds(ids); // Set user IDs
      } catch (err) {
        setError("Failed to fetch user IDs");
      }
    };

    fetchUserIds();
  }, []);
  // Handle Delete Book
  const handleDeleteBook = async (id) => {
    try {
      setLoading(true);
      const bookId = Number(id); // Convert ID to a number
      await api.delete(`/books/${bookId}`);
      setBooks(books.filter((book) => book.id !== bookId)); // Remove deleted book from the list
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete book");
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddBook = async () => {
    try {
      setLoading(true);
      const response = await api.post("/books", bookData);
      setBooks([...books, response.data]); // Add the new book to the list
      setShowModal(false); // Close the modal after adding
      resetBookData(); // Reset the form data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add book");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateBook = async () => {
    try {
      setLoading(true);
      const bookId = Number(bookData.id); // Convert ID to a number
      const response = await api.put(`/books/${bookId}`, bookData);
      const updatedBooks = books.map((book) =>
        book.id === bookId ? response.data : book
      );
      setBooks(updatedBooks); // Update the book in the list
      setShowModal(false); // Close the modal after updating
      resetBookData(); // Reset the form data
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update book");
    } finally {
      setLoading(false);
    }
  };

  const resetBookData = () => {
    setBookData({
      id: null,
      title: "",
      author: "",
      price: "",
      category: "",
      availability: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  // Handle change in input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Open the modal for adding a book
  const openAddBookModal = () => {
    resetBookData();
    setShowModal(true);
  };

  // Open the modal for updating a book
  const openUpdateBookModal = (book) => {
    setBookData(book);
    setShowModal(true);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-light p-3" style={{ width: "250px", height: "100vh" }}>
        <h4>Admin Panel</h4>
        <button
          className={`btn btn-block ${
            activeTab === "books" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setActiveTab("books")}
        >
          Books
        </button>
        <button
          className={`btn btn-block ${
            activeTab === "orders" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setActiveTab("orders")}
        >
          Order History
        </button>
        <button
          className={`btn btn-block ${
            activeTab === "sales" ? "btn-primary" : "btn-light"
          }`}
          onClick={() => setActiveTab("sales")}
        >
          Sales History
        </button>
      </div>

      {/* Main Content */}
      <div className="p-4 flex-grow-1">
        <h2>
          {activeTab === "books"
            ? "Books"
            : activeTab === "orders"
            ? "Order History"
            : "Sales History"}
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {/* Books */}
       {/* Show Add Book Button when on Books Tab */}
       {activeTab === "books" && (
          <button
            onClick={openAddBookModal}
            className="btn btn-success mb-3"
            style={{ display: "block", width: "100%" }}
          >
            Add Book
          </button>
        )}

        {/* Books List */}
        {activeTab === "books" && (
          <div className="row">
            {books.map((book) => (
              <div className="col-md-4" key={book.id}>
                <div className="card mb-4">
                  <div className="card-body">
                    <h5>{book.title}</h5>
                    <p>Author: {book.author}</p>
                    <p>Price: ${book.price}</p>
                    <p>Category: {book.category}</p>
                    <p>Available: {book.availability ? "Yes" : "No"}</p>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => openUpdateBookModal(book)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Adding/Updating Book */}
      {showModal && (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{bookData.id ? "Update Book" : "Add Book"}</h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={() => setShowModal(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      className="form-control"
                      value={bookData.title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="author">Author</label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      className="form-control"
                      value={bookData.author}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className="form-control"
                      value={bookData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      className="form-control"
                      value={bookData.category}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      className="form-control"
                      value={bookData.availability}
                      onChange={handleInputChange}
                    >
                      <option value={true}>Available</option>
                      <option value={false}>Not Available</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={bookData.id ? handleUpdateBook : handleAddBook}
                >
                  {loading ? "Loading..." : bookData.id ? "Update" : "Add"} Book
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        {/* Order History */}
        {activeTab === "orders" && (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh", width: "100%" }}
  >
    <div className="text-center w-50">
      {/* Dropdown to select user ID */}
      <div className="mb-3">
        <label htmlFor="orderNumber" className="form-label">
          Select User ID:
        </label>
        <select
          id="orderNumber"
          value={selectedNumber}
          onChange={(e) => setSelectedNumber(Number(e.target.value))}
          className="form-control"
        >
          {userIds.length === 0 ? (
            <option>Loading...</option>
          ) : (
            userIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))
          )}
        </select>
      </div>

      {orders.map((order) => (
        <div className="card mb-3 w-100" key={order.id}>
          <div className="card-body">
            <h5>Order ID: {order.id}</h5>
            <p>User ID: {order.userId}</p>
            <p>Total Amount: ${order.totalAmount}</p>
            <h6>Order Items:</h6>
            <ul>
              {order.OrderItems.map((item) => (
                <li key={item.id}>
                  {item.quantity}x {item.Book.title} - ${item.Book.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

{activeTab === "sales" && (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ minHeight: "100vh", width: "100%" }}
  >
    <div className="text-center w-50">
      {/* Dropdown for selecting period */}
      <div className="mb-3">
        <label htmlFor="period" className="form-label">
          Select Period
        </label>
        <select
          id="period"
          className="form-control"
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      {/* Render sales data */}
      {sales && sales.length > 0 ? (
        sales.map((sale) => (
          <div className="card mb-3 w-100" key={sale.BookId}>
            <div className="card-body">
              <h5>Book: {sale.BookTitle}</h5>
              <p>Period: {new Date(sale.period).toLocaleDateString()}</p>
              <p>Total Sales: ${sale.totalSales}</p>
              <p>Total Quantity Sold: {sale.totalQuantitySold}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No sales data available for this period.</p>
      )}
    </div>
  </div>
)}


      </div>
    
  );
};

export default AdminPage;
