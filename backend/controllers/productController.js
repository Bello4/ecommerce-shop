const Products = require('../models/productModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const cloudinary = require('cloudinary');

exports.createProductReview = catchAsync(async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        r => r.user.toString() === req.user._id.toString()
    )

    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length
    }

    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    })

})

// Get Product Reviews   =>   /api/v1/reviews
exports.getProductReviews = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})

// Delete Product Review   =>   /api/v1/reviews
exports.deleteReview = catchAsync(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    console.log(product);

    const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString());

    const numOfReviews = reviews.length;

    const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true
    })
})

exports.getAllProductData = catchAsync(async (req, res, next) => {

    const products = await Products.find()
  
    
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      products
    });
});

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined!'
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'this route is not yet defined! pleas use signup instead!!!'
    });
};

//exports.getUser = factory.getOne(User);
exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    res.status(200).json({
        success: true,
        user
    })
})




exports.updateProduct = catchAsync(async (req, res, next) => {
    let products = await Products.findById(req.params.id);

    if (!products) {
        return next(new AppError('Product not found', 404));
    }

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {

        // Deleting images associated with the product
        for (let i = 0; i < products.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(products.images[i].public_id)
        }

        let imagesLinks = [];

        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }

        req.body.images = imagesLinks

    }



    products = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
      status: 'success',
      products
    });
 
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const products = await Products.findById(req.params.id);

    if (!products) {
        return next(new AppError('Product not found', 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await products.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
});
exports.createProduct = catchAsync(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const products = await Products.create(req.body);

    res.status(201).json({
        success: true,
        products
    })
})
exports.getAllProduct = factory.getAll(Products);
exports.getProduct = factory.getOne(Products);
//exports.createProduct = factory.createOne(Products);
//exports.updateProduct = factory.updateOne(Products);
//exports.deleteProduct = factory.deleteOne(Products);

