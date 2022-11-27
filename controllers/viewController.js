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
  // updateUserData,
};
