const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const errorMiddleware = require('./controllers/errorController');
const AppError = require('./utils/appError');

const tourRouter = require(`${__dirname}/routes/tourRoutes`);
const userRouter = require(`${__dirname}/routes/userRoutes`);

const app = express();

// Global Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP, please try again in an hour',
});

app.use('/api', limiter);
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Handling Unhandled Routes - must be the last
app.all('*', (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} on this server`, 404),
  );
});

// Error Middleware
app.use(errorMiddleware);

module.exports = app;
