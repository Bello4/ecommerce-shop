const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// const filterObj = (obj, ...allowedFields) => {
//     const newObj = {};
//     Object.keys(obj).forEach(el => {
//       if (allowedFields.includes(el)) newObj[el] = obj[el];
//     });
//     return newObj;
// };

exports.getMe = (req, res, next) => {
    req.params.id = req.user._id;
    next();
}

exports.updateMe = catchAsync(async (req, res, next) => {
// 1) Create error if user POSTs password data
    // if (req.body.password || req.body.passwordConfirm) {
    //   return next(
    //     new AppError(
    //       'This route is not for password updates. Please use /updateMyPassword.',
    //       400
    //     )
    //   );
    // }
    const newUserData = {
      name: req.body.name,
      email: req.body.email
  }
  
  // Update avatar
  if (req.body.avatar !== '') {
      const user = await User.findById(req.user._id)

      const image_id = user.avatar.public_id;
      const res = await cloudinary.v2.uploader.destroy(image_id);

      const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
          crop: "scale"
      })

      newUserData.avatar = {
          public_id: result.public_id,
          url: result.secure_url
      }
  }
    //JSON.parse(JSON.stringify(newUserData))
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
      new: true,
      runValidators: true
  })
    
    res.status(200).json({
        status: 'success',
        user
    });

});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
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


exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await User.find()
  
    
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      users
    });
});

exports.updateUser = catchAsync(async (req, res, next) => {
    const users = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!users) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      users
    });
 
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const users = await User.findByIdAndDelete(req.params.id);

    if (!users) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      message: 'deleted.'
    });

});


//exports.getAllUsers = factory.getAll(User);
//exports.createUser = factory.createOne(User)
// do not update passwords with this!
//exports.updateUser = factory.updateOne(User);
//exports.deleteUser = factory.deleteOne(User);
