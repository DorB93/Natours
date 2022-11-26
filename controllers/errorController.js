const AppError = require('../utils/appError');

function sendErrorDev(err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
    return;
  }
  console.error('ERROR!!!', err);
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: `${err.message}`,
  });
}

function sendErrorProd(err, req, res) {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational, trusted error: send a message to client
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      return;
      // Programing or other unknown error: we don't want to leak error details
    } else {
      // Render generic message
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
      });
      return;
    }
  }
  if (err.isOperational) {
    // Operational, trusted error: send a message to client
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
    return;
    // Programing or other unknown error: we don't want to leak error details
  } else {
    // log error
    // console.error('ERROR ‼💢', err);

    // Send generic message
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: 'Please try again later.',
    });
    return;
  }
}

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err) {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value} Please use another value`;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

function handleJWTError(error) {
  return new AppError('Invalid token. Please log in again', 401);
}

function handleExpiredJWTError(error) {
  return new AppError('Expired token. Please log in again', 401);
}

function errorMiddleware(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.log(err.name);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }
    if (error.name === 'JsonWebTokenError')
      error = handleJWTError(error);
    if (error.name === 'TokenExpiredError')
      error = handleExpiredJWTError(error);
    sendErrorProd(error, req, res);
  }
}

module.exports = errorMiddleware;
