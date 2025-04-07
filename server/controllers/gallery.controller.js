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

exports.uploadImages = upload.any();

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  await Promise.all(
    req.files.map(async (file, i) => {
      const index = file.fieldname.split('[')[1].split(']')[0];
      const filename = `${file.originalname.split('.')[0]}-${Date.now()}-${i + 1}.jpg`;
      await sharp(file.buffer)
        .resize(640, 480)
        .toFormat('jpg')
        .jpeg({ quality: 80 })
        .toFile(`../public/img/uploads/${filename}`);
      req.body.images[index].image = filename;
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
  const piece = await Gallery.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      piece,
    },
  });
});

exports.updateGalleryPiece = catchAsync(async (req, res, next) => {
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
