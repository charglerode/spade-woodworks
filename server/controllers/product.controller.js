const Product = require('../models/Product');
const catchAsync = require('../utils/catch');
const AppError = require('../utils/error');

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new AppError(`No product found with id <${req.params.id}>`),
      404,
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});
