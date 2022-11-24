const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.idLoggedIn);

router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTourDetails);
router.get('/login', viewController.getLoginForm);

module.exports = router;
