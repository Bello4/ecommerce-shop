const express = require('express');
const productController = require('../controllers/productController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

// reviews should be made under a tour tour and also be see
// e.i POST /tour/234fad4/reviews
// e.i GET /tour/234fad4/reviews
// e.i GET /tour/234fad4/reviews/94888gh4

// router.route('/:productId/reviews')
// .post(
//  //   authController.protect, 
//     authController.restrictTo('user'), 
//     reviewController.createReview
//     );

//router.route('/:productId/reviews', reviewRouter);


// router
//   .route('/top-5-cheap')
//   .get(tourController.aliasTopTours, tourController.getAllTours);

// router.route('/tour-stats').get(tourController.getTourStats);
//router.route('/monthly-plan/:year').get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

//router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
// /tours-distance?distance=233&center=-40,45&unit=mi
// /tours- distance/233/center/-40,45/unit/mi

//router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/newproducts')
  .get(productController.getAllProduct)
  .post(authController.protect, authController.restrictTo('admin', 'seller'), productController.createProduct);
//authController.protect, authController.restrictTo('admin', 'seller'),
//getAllProductData
router
  .route('/admin/products')
  .get(authController.protect, authController.restrictTo('admin', 'seller'),productController.getAllProductData)
router
  .route('/reviews')
  .patch(authController.protect, productController.createProductReview)
  .get(authController.protect, productController.getProductReviews)
  .delete(authController.protect, productController.deleteReview)

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(authController.protect, authController.restrictTo('admin'), productController.updateProduct)
  .delete(authController.protect, authController.restrictTo('admin'), productController.deleteProduct
  );

//productController.uploadTourImages, tourController.resizetourImages,

module.exports = router;
