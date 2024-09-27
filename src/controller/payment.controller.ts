import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/user.model";
import express from "express";
import dotenv from 'dotenv';
import { stripeService } from "../services/stripe_service";
import {stripe} from "../services/stripe_service";
import Stripe from "stripe";
import { buffer } from "stream/consumers";
dotenv.config();

export const createPaymentIntent = async (req: express.Request, res: express.Response) => {
    const { amount, currency,userId, userEmail} = req.body;
  
    // Validate required fields
    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
         msg: 'Amount and currency are required' ,
      });
    }
  
    try {
      const paymentIntent = await stripeService.createPaymentIntent({
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
    } catch (error) {
      console.error('Payment error:', error);
      return res.status(500).json({
        success: false,
        msg: 'Failed to create payment intent',
      });
    }
};

export const createCheckoutSession = async (req: express.Request, res: express.Response) => {
    try {
        const { items } = req.body; // Items should include price IDs from your Stripe dashboard

        // Create a Checkout Session with Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'], // Define allowed payment methods
            mode: 'payment', // Use 'payment' for one-time purchases
            line_items: items.map((item: any) => ({
                price: item.priceId, // Use price IDs from your Stripe products
                quantity: item.quantity,
            })),
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // URL on successful payment
            cancel_url: `${process.env.CLIENT_URL}/cancel`, // URL if payment is canceled
            customer_email: req.body.email, // Optional: Prefill the customer’s email
            metadata: {
                userId: req.body.userId, // Pass custom metadata for tracking
                orderId: req.body.orderId, // Optional: Track your orders
            },
        });

        // Respond with the session URL to redirect the user
        return res.status(200).json({
            success: true,
            url: session.url, // Send the session URL to the client for redirection
        });
    } catch (error) {
        console.error('Error creating Stripe Checkout Session:', error);
        return res.status(500).json({ success: false, error: 'Failed to create checkout session' });
    }
};

export const stripeWebhookHandler = async (req: express.Request, res: express.Response) => {
    const webhookSecret = process.env.STRIPE_WEBHOKK_SECRET_KEY as string;
  
    // Buffer the request body to validate the Stripe signature
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'] as string;
  
    let event: Stripe.Event;
  
    try {
      // Verify the webhook signature
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed: ${(err as Error)?.message}`);
      return res.status(400).send(`Webhook Error: ${(err as Error)?.message}`);
    }
  
    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent was successful: ${paymentIntent.id}`);
        // Handle successful payment intent (e.g., update order status)
        break;
      case 'payment_intent.payment_failed':
        const failedPaymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent failed: ${failedPaymentIntent.id}`);
        // Handle failed payment (e.g., notify the user)
        break;
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout Session completed: ${session.id}`);
        // Handle successful checkout session (e.g., fulfill order)
        break;
      case 'checkout.session.expired':
        const expiredSession = event.data.object as Stripe.Checkout.Session;
        console.log(`Checkout Session expired: ${expiredSession.id}`);
        // Handle expired session
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  
    res.status(200).json({received: true });
  };