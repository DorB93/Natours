const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(viewController.alerts);

router.get(
  '/',
  authController.idLoggedIn,
  viewController.getOverview,
);
router.get(
  '/tour/:slug',
  authController.idLoggedIn,
  viewController.getTourDetails,
);
router.get('/signup', viewController.getSignupForm);
router.get('/login', viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/my-bookings',
  authController.protect,
  viewController.getMyTours,
);

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewController.updateUserData,
// );

module.exports = router;
