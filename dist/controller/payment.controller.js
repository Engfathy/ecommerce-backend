"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhookHandler = exports.createCheckoutSession = exports.createPaymentIntent = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const stripe_service_1 = require("../services/stripe_service");
const stripe_service_2 = require("../services/stripe_service");
const consumers_1 = require("stream/consumers");
dotenv_1.default.config();
const createPaymentIntent = async (req, res) => {
    const { amount, currency, userId, userEmail } = req.body;
    // Validate required fields
    if (!amount || !currency) {
        return res.status(400).json({
            success: false,
            msg: 'Amount and currency are required',
        });
    }
    try {
        const paymentIntent = await stripe_service_1.stripeService.createPaymentIntent({
            amount: Number(amount),
            currency,
            metadata: {
                userId: userId,
                userEmail: userEmail,
            },
        });
        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.clientSecret,
        });
    }
    catch (error) {
        console.error('Payment error:', error);
        return res.status(500).json({
            success: false,
            msg: 'Failed to create payment intent',
        });
    }
};
exports.createPaymentIntent = createPaymentIntent;
const createCheckoutSession = async (req, res) => {
    try {
        const { items } = req.body; // Items should include price IDs from your Stripe dashboard
        // Create a Checkout Session with Stripe
        const session = await stripe_service_2.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: items.map((item) => ({
                price: item.priceId,
                quantity: item.quantity,
            })),
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            customer_email: req.body.email,
            metadata: {
                userId: req.body.userId,
                orderId: req.body.orderId, // Optional: Track your orders
            },
        });
        // Respond with the session URL to redirect the user
        return res.status(200).json({
            success: true,
            url: session.url, // Send the session URL to the client for redirection
        });
    }
    catch (error) {
        console.error('Error creating Stripe Checkout Session:', error);
        return res.status(500).json({ success: false, error: 'Failed to create checkout session' });
    }
};
exports.createCheckoutSession = createCheckoutSession;
const stripeWebhookHandler = async (req, res) => {
    const webhookSecret = process.env.STRIPE_WEBHOKK_SECRET_KEY;
    // Buffer the request body to validate the Stripe signature
    const buf = await (0, consumers_1.buffer)(req);
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        // Verify the webhook signature
        event = stripe_service_2.stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    }
    catch (err) {
        console.log(`⚠️  Webhook signature verification failed: ${err?.message}`);
        return res.status(400).send(`Webhook Error: ${err?.message}`);
    }
    // Handle the event based on its type
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
            // Handle successful payment intent (e.g., update order status)
            break;
        case 'payment_intent.payment_failed':
            const failedPaymentIntent = event.data.object;
            console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`);
            // Handle failed payment (e.g., notify the user)
            break;
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log(`Checkout Session completed: ${session.id}`);
            // Handle successful checkout session (e.g., fulfill order)
            break;
        case 'checkout.session.expired':
            const expiredSession = event.data.object;
            console.log(`Checkout Session expired: ${expiredSession.id}`);
            // Handle expired session
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }
    res.status(200).json({ received: true });
};
exports.stripeWebhookHandler = stripeWebhookHandler;
//# sourceMappingURL=payment.controller.js.map