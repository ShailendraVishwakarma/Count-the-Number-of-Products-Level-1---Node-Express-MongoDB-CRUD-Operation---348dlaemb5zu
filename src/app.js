const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/my_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/', async (req, res) => {
  const { category, range } = req.query;

  // Construct the filter object based on the query parameters
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (range) {
    const [minPrice, maxPrice] = range.split('-');
    if (minPrice && !maxPrice) {
      filter.price = { $gte: parseInt(minPrice) };
    } else if (!minPrice && maxPrice) {
      filter.price = { $lte: parseInt(maxPrice) };
    } else if (minPrice && maxPrice) {
      filter.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
    }
  }

  try {
    // Get the count of products that match the filter
    const count = await Product.countDocuments(filter);

    // Send the count as a response
    res.send(`Count: ${count}`);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

app.listen(3000, () => console.log('Server started on port 3000'));


module.exports = app;
