import { createCheckoutSession, createPaymentIntent, stripeWebhookHandler } from '../controller/payment.controller';
import express from "express"
const paymentRouter: express.Router = express.Router();

paymentRouter.post('/create-payment-intent', createPaymentIntent);
paymentRouter.post('/create-payment-session', createCheckoutSession);
paymentRouter.post('/payment-webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default paymentRouter;