const stripe = require(`stripe`)(process.env.STRIPE_S_KEY);
const Booking = require(`./../models/bookingModel`);
const Tour = require(`./../models/tourModel`);

const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

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
      success_url: `${req.protocol}://${req.get(
        'host',
      )}/my-bookings?alert=booking`,
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
async function createBookingCheckout(session) {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email }))
    ._id;
  const price = session.amount_total / 100;
  await Booking.create({ tour, user, price });
}

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  let booking = {};
  if (event.type === 'checkout.session.completed') {
    booking = await createBookingCheckout(event.data.object);
  }
  res.status(200).json({ received: true, booking });
};
exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
