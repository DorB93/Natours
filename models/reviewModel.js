// review / rating / createAt / ref Tour / ref User
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      require: true,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createAt: { type: Date, default: Date.now() },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must  belong to a user.'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: ['-__v', '-role', '-email', '-passwordChangedAt'],
  });
  // .populate({
  //   path: 'tour',
  //   select: [
  //     '-__v',
  //     '-images',
  //     '-imageCover',
  //     '-description',
  //     '-secretTour',
  //     '-locations',
  //   ],
  // });

  next();
});
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
