
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();
console.log(process.env.STRIPE_SECRET_KEY)
// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // Use the latest API version
});


// interface CreatePaymentIntentParams {
//   amount: number; // Amount in cents (e.g., 5000 for $50.00)
//   currency: string; // Currency code (e.g., 'usd')
// }

class StripeService {
  // Method to create a payment intent
  public async createPaymentIntent(params :any) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: params.amount,
        currency: params.currency,
        payment_method_types: ['card'],
      });

      return { clientSecret: paymentIntent.client_secret };
    } catch (error: any) {
      // Log error for monitoring
      console.error('Error creating payment intent:', error.message);
      throw new Error('Unable to create payment intent');
    }
  }
}

const stripeService = new StripeService();

export { stripeService , stripe };

