const Order = require('../models/ordersModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
exports.newOrder = catchAsync(async (req, res, next) => {

    const { orderItems, shippingInfo, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo } = req.body;
  
      const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
      });
  
      res.status(201).json({
        status: 'success',
        order
      });
  
});

exports.getMyOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })

    res.status(200).json({
        success: true,
        orders
    })
})
exports.getOrder = catchAsync(async (req, res, next) => {
    
  let query = Order.findById(req.params.id);
  
  const orders = await query;
  
  if (!orders) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    orders
  });

});

exports.getAllOrder = catchAsync(async (req, res, next) => {

  const orders = await Order.find()

  
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    orders
  });
});
//exports.getAllOrder = factory.getAll(Order);
//exports.getOrder = factory.getOne(Order);
//exports.createOrder = factory.createOne(Order);
exports.updateOrder = factory.updateOne(Order);
exports.deleteOrder = factory.deleteOne(Order);