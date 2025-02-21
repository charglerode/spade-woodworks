const Quote = require('../models/Quote');
const catchAsync = require('../utils/catch');
const AppError = require('../utils/error');

exports.getQuotes = catchAsync(async (req, res, next) => {
  const quote = await Quote.aggregate([{ $sample: { size: 1 } }]);

  res.status(200).json({
    status: 'success',
    data: {
      quote,
    },
  });
});
