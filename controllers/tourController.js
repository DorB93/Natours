const multer = require('multer');
const sharp = require('sharp');

const Tour = require(`${__dirname}/../models/tourModel`);
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
// const tours = JSON.parse(fs.readFileSync(toursFileRoot));

// });
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Not an image! Please upload only images.', 400),
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

async function resizeTourImages(req, res, next) {
  try {
    if (!req.files.imageCover || !req.files.images) {
      return next();
    }

    req.body.imageCover = `tour-${
      req.params.id
    }-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/tours/${req.body.imageCover}`);

    req.body.images = [];

    await Promise.all(
      req.files.images.map(async (file, i) => {
        const fileName = `tour-${req.params.id}-${Date.now()}-${
          i + 1
        }.jpeg`;

        await sharp(file.buffer)
          .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 90 })
          .toFile(`public/img/tours/${fileName}`);
        req.body.images.push(fileName);
      }),
    );

    next();
  } catch (err) {
    next(err);
  }
}

const getAllTours = factory.getAll(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });
const createTour = factory.createOne(Tour);
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

function aliasTopTours(req, res, next) {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
}

async function getTourStats(req, res, next) {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
      // { $match: { _id: { $ne: 'EASY' } } },
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getMonthlyPlan(req, res, next) {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numToursStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numToursStarts: -1 },
      },
    ]);

    res.status(200).json({
      status: 'success',
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getToursWithin(req, res, next) {
  try {
    ///tour-within/:distance/center/:latlng*/unit/:unit
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const radius =
      unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
    if (!lat || !lng) {
      return next(
        new AppError(
          'Please provide latitude ang longittude in format lat,lng.',
          400,
        ),
      );
    }
    console.log({ distance }, { lat }, { lng }, { unit });

    const tours = await Tour.find({
      startLocation: {
        $geoWithin: { $centerSphere: [[lng, lat], radius] },
      },
    });

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        data: tours,
      },
    });
  } catch (err) {
    next(err);
  }
}
async function getDistances(req, res, next) {
  try {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');
    const multiplier = unit === 'mi' ? 0.00062137 : 0.001;
    if (!lat || !lng) {
      return next(
        new AppError(
          'Please provide latitude ang longittude in format lat,lng.',
          400,
        ),
      );
    }
    const distances = await Tour.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng * 1, lat * 1] },
          distanceField: 'distance',
          distanceMultiplier: multiplier,
        },
      },
      {
        $project: {
          distance: 1,
          name: 1,
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        data: distances,
      },
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
  getDistances,
  uploadTourImages,
  resizeTourImages,
};
