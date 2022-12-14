import { showAlert } from './alerts';
import { HOST } from './hostUrl';
const stripe = Stripe(
  'pk_test_51M9UV9ImQyZnPplT13DBtfazdRbtZ41rJYLk8NPVrlQWVolNqBcj2LRdk6yYkINbJC5RZEFsja46oUGXjgJd4gAq000IExBQ8t',
);

export async function bookTour(tourId) {
  try {
    // 1) get the session from the server
    const data = await fetch(
      `${HOST}/api/v1/bookings/checkout-session/${tourId}`,
    );
    const session = await data.json();
    // console.log(session);
    //2) Create the checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
}
