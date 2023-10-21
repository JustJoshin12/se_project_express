const mongoose = require('mongoose');
const validator = require('validator');

const user = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  avatar: {
    type: String,
    required: true,
    validator: {
      validator: (v) => validator.isURL(v),
      message: 'Link is not Valid',
    },
  }
})

module.exports = mongoose.model('user', user);
