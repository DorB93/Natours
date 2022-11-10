const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

function checkUserID(req, res, next, val) {
  /////////
  next();
}

function filterObj(obj, ...allowedFields) {
  let filteredObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      filteredObj[el] = obj[el];
    }
  });
  return filteredObj;
}
async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    // 1) Create error if user POSTs Password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates!!. Please use /updateMyPassword route!',
          400,
        ),
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    // 3) update user doc
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function deleteMe(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    next(err);
  }
}
function getUser(req, res) {
  const user = users.find((u) => u.id === +req.params.id);
  res.status(200).json({
    status: 'success',
    requestAt: req.requestTime,
    results: users.length,
    data: {
      user,
    },
  });
}
function createUser(req, res) {
  res.status(201).json({
    status: 'success',
    requestAt: req.requestTime,
    data: {
      users,
    },
  });
}
const updateUser = factory.updateOne(User);
const deleteUser = factory.deleteOne(User);

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  checkUserID,
  updateMe,
  deleteMe,
};
