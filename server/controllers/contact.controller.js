const Contact = require('../models/Contact');
const Email = require('../utils/email');
const catchAsync = require('../utils/catch');
const AppError = require('../utils/error');

exports.sendEmail = catchAsync(async (req, res, next) => {
  try {
    await new Email('', '').sendContactMessage(
      req.body.name,
      req.body.email,
      req.body.reason,
      req.body.message,
    );
    res.status(200).json({
      status: 'success',
      message: 'Message was sent',
    });
  } catch (err) {
    return next(
      new AppError(`Error sending message. Try again later, ${err}`, 500),
    );
  }
});
