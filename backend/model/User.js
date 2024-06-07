const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['User', 'Admin', 'Carrier', 'Restaurant'], // Adjust the roles as needed
    default: 'User'
  },
  banned: {
    type: Boolean,
    default: false
  },
  streetAddress: {
    type: String
  },
  postalCode: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  phone: {
    type: String
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
