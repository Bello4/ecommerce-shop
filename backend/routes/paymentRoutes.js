const express = require('express');
const paymentController = require('../controllers/paymentController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.use(authController.protect);

//router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

// router.use(authController.restrictTo('user'));
router
  .route('/process')
  .post(paymentController.processPayment);
router
  .route('/stripeapi')
  .get(paymentController.sendStripApi)
//authController.isAuthenticatedUser,
module.exports = router;