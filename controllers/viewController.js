const Booking = require('../models/bookingModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const Tour = require('./../models/tourModel');

const getOverview = async (req, res, next) => {
  try {
    // Get Tours Data from collection
    const tours = await Tour.find();
    // Build template

    // render the template
    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  } catch (error) {
    next(error);
  }
};

const getTourDetails = async (req, res, next) => {
  try {
    const tour = await Tour.findOne({
      slug: req.params.slug,
    }).populate({ path: 'reviews', fields: 'review rating user' });

    if (!tour) {
      throw new AppError(`There is no tour with that name.`, 404);
    }
    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
  } catch (err) {
    next(err);
  }
};

const getLoginForm = async (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: `Your account`,
  });
};

async function getMyTours(req, res, next) {
  try {
    // find all of the user booking
    const bookings = await Booking.find({ user: req.user._id });

    // find tours with the returned ID's
    const tours = await Promise.all(
      bookings.map(async (book) => {
        const tour = await Tour.findById(book.tour);
        tour.price = book.price;
        tour.bookedIn = book.createAt;
        return tour;
      }),
    );
    res.status(200).render('overview', {
      title: 'My Bookings',
      tours,
    });
  } catch (err) {
    next(err);
  }
}
async function alerts(req, res, next) {
  try {
    const { alert } = req.query;
    if (alert === 'booking') {
      res.locals.alert =
        "Your booking wes successful! Please check your email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
    }
    next();
  } catch (err) {
    next();
  }
}
// const updateUserData = async (req, res, next) => {
//   try {
//     console.log('update', req.body);
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       {
//         name: req.body.name,
//         email: req.body.email,
//       },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );
//     res.status(200).render('account', {
//       title: `Your account`,
//       user: updatedUser,
//     });
//   } catch (error) {
//     next();
//   }
// };
module.exports = {
  getOverview,
  getTourDetails,
  getLoginForm,
  getAccount,
  getMyTours,
  alerts,
  // updateUserData,
};
