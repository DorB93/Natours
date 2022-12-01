const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');
const bookingController = require('./../controllers/bookingController');

const router = express.Router();

router.get(
  '/',
  bookingController.createBookingCheckout,
  authController.idLoggedIn,
  viewController.getOverview,
);
router.get(
  '/tour/:slug',
  authController.idLoggedIn,
  viewController.getTourDetails,
);
router.get(
  '/login',
  authController.idLoggedIn,
  viewController.getLoginForm,
);
router.get('/me', authController.protect, viewController.getAccount);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData,
// );

module.exports = router;
