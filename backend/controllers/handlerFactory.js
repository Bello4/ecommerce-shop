const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'deleted.'
    });

});
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      doc
    });
 
});

exports.createOne = Model => catchAsync(async (req, res, next) => {

  // const newTour = new Tour({})
    // newTour.save()

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      doc
    });

});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    
    const product = await query;
    
    if (!product) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      product
    });
 
});

exports.getAll = (Model) => catchAsync(async (req, res, next) => {
  
    // to allow for nested get reviews on tour
   //return next(new ErrorHandler('my error', 404))
    const resPerPage = 4;
    const productCount = await Model.countDocuments();
    
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .search()
      .sort()
      .limitFields()

      let products = await features.query;
      let filterProductCount = products.length;

      features.paginate(resPerPage)
      products = await features.query;

      
    // const doc = await features.query.explain();
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: products.length,
      products,
      productCount,
      filterProductCount,
      resPerPage
      
    });
 
});



