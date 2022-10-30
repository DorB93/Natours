require('dotenv').config({ path: './config.env', override: true });
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

async function singup(req, res, next) {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      photo: req.body.photo,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);
    res.status(201).json({
      status: 'success',
      token,
      data: {
        newUser,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Check if email & password exist
    if (!email || !password) {
      return next(
        new AppError('Please provide email and password!', 400),
      );
    }
    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      return next(new AppError('Incorrect email or password', 401));
    }
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (err) {
    next(err);
  }
}

async function protect(req, res, next) {
  try {
    // Getting token and check if is it there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    if (!token)
      return next(
        new AppError(
          'You are not logged in! Please log in to ger access',
          401,
        ),
      );
    // Verifiction token

    // check if user still exists

    // Check user chnged password after the token eas issued

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  singup,
  login,
  protect,
};
