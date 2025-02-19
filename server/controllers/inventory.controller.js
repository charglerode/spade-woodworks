const Product = require('../models/Product');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catch');
const AppError = require('../utils/error');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
      cb(null, true);
    } else {
      cb(new AppError('Use only image files', 400), false);
    }
  },
});

exports.upload = upload.single('images');

exports.resize = (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `${req.file.originalname}-${Date.now()}`;
  sharp(req.file.buffer)
    .resize(800, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`../public/img/uploads/${req.file.filename}.jpeg`);
  next();
};

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

exports.createProduct = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.images = req.file.filename;
  }
  const product = await Product.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.images = req.file.filename;
  }
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(
      new AppError(`No product found with id <${req.params.id}>`),
      404,
    );
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
