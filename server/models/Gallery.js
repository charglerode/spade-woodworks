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
  images: [
    {
      image: {
        type: String,
        trim: true,
      },
      caption: {
        type: String,
        trim: true,
      },
    },
  ],
});

const Gallery = mongoose.model('Gallery', gallery);

module.exports = Gallery;
