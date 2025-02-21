const mongoose = require('mongoose');
const validator = require('validator');

const contact = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '<NAME> is required'],
    minLength: 2,
    maxLength: 50,
  },
  email: {
    type: String,
    required: [true, '<EMAIL> is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Valid <EMAIL> is required'],
  },
  reason: {
    type: String,
    required: [true, 'A contact message must have a <REASON>'],
  },
  message: {
    type: String,
    required: [true, 'A contact message must have a <MESSAGE>'],
    trim: true,
  },
});

const Contact = mongoose.model('Contact', contact);

module.exports = Contact;
