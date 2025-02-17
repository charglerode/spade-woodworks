const crypto = require('crypto');
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
  resetToken: String,
  resetExpire: Date,
});

user.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

user.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.modified = Date.now() - 1000;
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

user.methods.resetPasswordToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetExpire = Date.now() + 10 * 60 * 1000;
  return token;
};

const User = mongoose.model('User', user);

module.exports = User;
