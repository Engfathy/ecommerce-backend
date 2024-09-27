"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payment_controller_1 = require("../controller/payment.controller");
const express_1 = __importDefault(require("express"));
const paymentRouter = express_1.default.Router();
paymentRouter.post('/create-payment-intent', payment_controller_1.createPaymentIntent);
paymentRouter.post('/create-payment-session', payment_controller_1.createCheckoutSession);
paymentRouter.post('/payment-webhook', express_1.default.raw({ type: 'application/json' }), payment_controller_1.stripeWebhookHandler);
exports.default = paymentRouter;
//# sourceMappingURL=paymentRouter.js.map