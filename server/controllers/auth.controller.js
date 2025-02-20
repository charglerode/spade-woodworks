const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/User');
const catchAsync = require('../utils/catch');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/error');
const Email = require('../utils/email');

const sign = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = sign(user._id);
  const options = {
    expire: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.cookie('jwt', token, options);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and pasword', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.validatePassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  createSendToken(user, 200, res);
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

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError('There is no user with that email address', 404));
  const token = user.resetPasswordToken();
  await user.save({ validateBeforeSave: false });
  try {
    // const resetUrl = `${req.protocol}://localhost:4200/reset/${token}`;
    const resetUrl = `${req.protocol}://${req.get('host')}/reset/${token}`;
    await new Email(user, resetUrl).sendResetPassword();
    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent',
    });
  } catch (err) {
    user.resetToken = undefined;
    user.resetExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(`Error sending reset email. Try again later, ${err}`, 500),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    resetToken: hashedToken,
    resetExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetExpire = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.validatePassword(req.body.password, user.password))) {
    return next(
      new AppError('Your password is incorrect. Please try again', 401),
    );
  }
  user.password = req.body.newPassword;
  await user.save();
  createSendToken(user, 200, res);
});
