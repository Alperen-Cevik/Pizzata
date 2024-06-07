// models/MenuItem.js
const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant_id: {
    type: String,
    required: true
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  basePrice: {
    type: String,
    required: true
  },
  sizes: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  extraIngredientPrices: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
