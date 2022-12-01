const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: Tour,
    required: [true, 'Booking Must belong to a tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: [true, 'Booking Must belong to a user!'],
  },
  price: {
    type: Number,
    require: [true, 'booking must have a price'],
  },
  createAt: {
    type: Date,
    default: Date.now(),
  },
  paid: {
    type: Boolean,
    default: true,
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'tour',
    select: ['name', 'guides'],
  });
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
