const mongoose = require('mongoose');

const gallery = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  teaser: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  cover: [String],
  images: [String],
});

const Gallery = mongoose.model('Gallery', gallery);

module.exports = Gallery;
