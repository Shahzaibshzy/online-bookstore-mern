const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const salesRoutes = require('./routes/salesRoutes');


const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/books', bookRoutes);
app.use('/orders', orderRoutes);
app.use('/users', userRoutes);
app.use('/sales', salesRoutes);

const PORT = process.env.PORT || 5000;

// Sync models with database and start the server
sequelize
  .sync({ alter: true }) // This will create or update tables based on models
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log('Tables created/updated successfully!');
  })
  .catch((error) => console.error('Error creating tables:', error));
