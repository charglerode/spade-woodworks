const mongoose = require('mongoose');

const quote = new mongoose.Schema({
  line: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  attribution: {
    type: String,
    required: true,
    default: 'Unknown',
  },
});

const Quote = mongoose.model('Quote', quote);

module.exports = Quote;
