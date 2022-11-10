const AppError = require('../utils/appError');
const APIFeatuers = require('../utils/APIFeatures');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function getAllReviews(req, res, next) {
  try {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatuers(Review.find(filter), req.query)
      .sort()
      .limitFields()
      .paginate();
    const reviews = await features.query;
    res.status(200).json({
      status: 'success',
      results: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    // allow Nested routes
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = req.user._id;
    const newReview = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateReview(req, res, next) {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!review) {
      return next(new AppError('No review found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        review,
      },
    });
  } catch (err) {
    next(err);
  }
}

const deleteReview = factory.deleteOne(Review);

// async function deleteReview(req, res, next) {
//   try {
//     const review = await Review.findByIdAndDelete(req.params.id);

//     if (!review) {
//       return next(new AppError('No review found with that ID', 404));
//     }

//     res.status(204).json({
//       status: 'success',
//       data: null,
//     });
//   } catch (err) {
//     next(err);
//   }
// }

module.exports = {
  getReview,
  createReview,
  updateReview,
  getAllReviews,
  deleteReview,
};
