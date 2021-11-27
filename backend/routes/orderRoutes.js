const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.use(authController.protect);


//router.use(authController.restrictTo('user'));
router.get('/me', orderController.getMyOrder)
router.post('/new', orderController.newOrder);
router
  .route('/admin')
  .get(authController.restrictTo('admin'), orderController.getAllOrder)
  
//authController.protect, authController.restrictTo('admin', 'seller'),
router.get('/:id', orderController.getOrder)

//getOrder
router
  .route('/admim/:id')
  .patch(authController.restrictTo('admin'), orderController.updateOrder)
  .delete(authController.restrictTo('admin'), orderController.deleteOrder);


module.exports = router;