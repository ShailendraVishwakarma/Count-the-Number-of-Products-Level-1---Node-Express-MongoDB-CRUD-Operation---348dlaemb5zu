const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product'); // assuming the product schema is defined in a separate file

const app = express();

// connect to MongoDB
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// define the route
app.get('/', async (req, res) => {
  try {
    const { category, range } = req.query;

    const query = {};

    if (category) {
      query.category = category;
    }

    if (range) {
      const [minPrice, maxPrice] = range.split('-').map(Number);

      if (minPrice) {
        query.price = { $gte: minPrice };
      }

      if (maxPrice) {
        query.price = { ...query.price, $lte: maxPrice };
      }
    }

    const count = await Product.countDocuments(query);

    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


module.exports = app;
