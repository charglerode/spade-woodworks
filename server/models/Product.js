const mongoose = require('mongoose');

const product = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a <NAME>'],
    unique: [true, 'A product must have a <UNIQUE NAME>'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a <PRICE>'],
  },
  available: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: [true, 'A product must have a <CATEGORY>'],
    trim: true,
    enum: {
      values: ['Wood Care', 'Crafts', 'Furniture'],
      message:
        'A product must belong to a <CATEGORY>: wood care, crafts, furniture',
    },
  },
  description: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  images: [String],
  options: [
    {
      name: {
        type: String,
        trim: true,
        required: [true, 'A product option requires a <GROUP>'],
      },
      items: [
        {
          name: {
            type: String,
            trim: true,
            required: [true, 'Product option <NAME> is required'],
          },
          price: {
            type: Number,
            default: 0,
          },
          image: String,
          fixed: {
            type: Boolean,
            default: true,
          },
          multiplier: {
            type: Number,
            default: 0,
          },
          default: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

const Product = mongoose.model('Product', product);

module.exports = Product;
