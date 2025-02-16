const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { isThisTypeNode } = require('typescript');

const user = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, '<PASSWORD> is required'],
    minLength: 8,
    select: false,
  },
  modified: Date,
});

user.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

user.methods.validatePassword = async function (candidate, password) {
  return await bcrypt.compare(candidate, password);
};

user.methods.lastModified = function (timestamp) {
  if (this.modified) {
    const modifiedTimestamp = parseInt(this.modified.getTime() / 1000, 10);
    return timestamp < modifiedTimestamp;
  }
  return false;
};

const User = mongoose.model('User', user);

module.exports = User;
