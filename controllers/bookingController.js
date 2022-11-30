const stripe = require(`stripe`)(process.env.STRIPE_S_KEY);
const Tour = require(`${__dirname}/../models/tourModel`);
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
  try {
    // get currently booked tour
    const tour = await Tour.findById(req.params.tourID);
    if (!tour) {
      throw new AppError('No tour found with that ID', 404);
    }
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      success_url: `${req.protocol}://${req.get('host')}/`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${
        tour.slug
      }`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourID,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
            },
            unit_amount: tour.price * 100,
          },
          quantity: 1,
        },
      ],
    });
    res.status(200).json({
      status: 'success',
      session,
    });
  } catch (err) {
    next(err);
  }
};
