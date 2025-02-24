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

exports.uploadImages = upload.array('images');

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  req.body.images = [];
  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `${file.originalname.split('.')[0]}-${Date.now()}-${i + 1}.jpg`;
      await sharp(file.buffer)
        .resize(800, 600)
        .toFormat('jpg')
        .jpeg({ quality: 90 })
        .toFile(`../public/img/uploads/${filename}`);
      req.body.images.push(filename);
    }),
  );
  next();
});

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

exports.getFeaturedProduct = catchAsync(async (req, res, next) => {
  const product = await Product.find().where('featured').equals(true);

  if (!product[0]) {
    return next(new AppError(`No featured product`), 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      product: product[0],
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
