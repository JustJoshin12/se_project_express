const mongoose = require('mongoose');
const validator = require('validator');

const clothingItem = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30
  },
  weather:{
    type:String,
    required:true,
    enum: ['hot', 'warm', 'cold']
  },
  imageURL: {
    type: String,
    required: true,
    validator: {
      validator: (v) => validator.isURL(v),
      message: 'Link is not Valid',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('clothingItems', clothingItem);