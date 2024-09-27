"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = exports.stripeService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
console.log(process.env.STRIPE_SECRET_KEY);
// Initialize Stripe with the secret key from environment variables
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20', // Use the latest API version
});
exports.stripe = stripe;
// interface CreatePaymentIntentParams {
//   amount: number; // Amount in cents (e.g., 5000 for $50.00)
//   currency: string; // Currency code (e.g., 'usd')
// }
class StripeService {
    // Method to create a payment intent
    async createPaymentIntent(params) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: params.amount,
                currency: params.currency,
                payment_method_types: ['card'],
            });
            return { clientSecret: paymentIntent.client_secret };
        }
        catch (error) {
            // Log error for monitoring
            console.error('Error creating payment intent:', error.message);
            throw new Error('Unable to create payment intent');
        }
    }
}
const stripeService = new StripeService();
exports.stripeService = stripeService;
//# sourceMappingURL=stripe_service.js.map