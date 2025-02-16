const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catch');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/error');

const sign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const token = sign(user._id);
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and pasword', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.validate(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  const token = sign(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Must login in to gain access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const fresh = await User.findById(decoded.id);
  if (!fresh) {
    return next(new AppError('The user for this token no longer exists', 401));
  }
  if (fresh.lastModified(decoded.iat)) {
    return next(
      new AppError('Credentials recently changed. Please login again', 401),
    );
  }

  req.user = fresh;
  next();
});
