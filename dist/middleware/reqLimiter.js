"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordLimiter = exports.forgetPasswordLimiter = exports.createAccountLimiter = exports.defaultLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
function keyGenerator(request, _response) {
    if (!request.ip) {
        console.error("Warning: request.ip is missing!");
        return request.socket.remoteAddress;
    }
    else {
        console.log(request.ip, request.socket.remoteAddress);
    }
    return request.ip.replace(/:\d+[^:]*$/, "");
}
exports.defaultLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000,
    limit: 300,
    message: "Too many request from this ip try again after 5 min",
    keyGenerator: keyGenerator, //generates a key used to identify the client for rate limiting. 
});
exports.createAccountLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000,
    limit: 4,
    message: "Too many accounts created from this IP, please try again after an hour",
    keyGenerator: keyGenerator,
});
exports.forgetPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 2,
    message: "Too many attemot from this IP, please try again after 2 hour",
    keyGenerator: keyGenerator,
});
exports.ResetPasswordLimiter = (0, express_rate_limit_1.default)({
    windowMs: 2 * 60 * 60 * 1000,
    limit: 2,
    message: "Too many attemot from this IP to this request, please try again after 2 hour",
    keyGenerator: keyGenerator,
});
//# sourceMappingURL=reqLimiter.js.map