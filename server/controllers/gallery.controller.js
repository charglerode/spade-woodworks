const Gallery = require('../models/Gallery');
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

exports.uploadImages = upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'images' },
]);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files.cover || !req.files.images) return next();

  req.body.cover = `${req.files.cover[0].originalname.split('.')[0]}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.cover[0].buffer)
    .resize(1024, 768)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`../public/img/uploads/${req.body.cover}`);

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `${file.originalname.split('.')[0]}-${Date.now()}-${i + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(800, 600)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`../public/img/uploads/${filename}`);
      req.body.images.push(filename);
    }),
  );
  next();
});

exports.getGallery = catchAsync(async (req, res, next) => {
  const gallery = await Gallery.find();

  res.status(200).json({
    status: 'success',
    results: gallery.length,
    data: {
      gallery,
    },
  });
});

exports.getGalleryPiece = catchAsync(async (req, res, next) => {
  const piece = await Gallery.findById(req.params.id);

  if (!piece) {
    return next(
      new AppError(`No gallery piece found with id <${req.params.id}>`),
      404,
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      piece,
    },
  });
});

exports.createGalleryPiece = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.images = req.file.filename;
  }
  const piece = await Gallery.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      piece,
    },
  });
});

exports.updateGalleryPiece = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.images = req.file.filename;
  }
  const piece = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!piece) {
    return next(
      new AppError(`No gallery piece found with id <${req.params.id}>`),
      404,
    );
  }

  res.status(200).json({
    status: 'success',
    data: {
      piece,
    },
  });
});

exports.deleteGalleryPiece = catchAsync(async (req, res, next) => {
  const piece = await Gallery.findByIdAndDelete(req.params.id);

  if (!piece) {
    return next(
      new AppError(`No gallery piece found with id <${req.params.id}>`),
      404,
    );
  }

  res.status(200).json({
    status: 'success',
    data: null,
  });
});
