const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

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
router.get(
  '/login',
  authController.idLoggedIn,
  viewController.getLoginForm,
);
router.get('/me', authController.protect, viewController.getAccount);
module.exports = router;
