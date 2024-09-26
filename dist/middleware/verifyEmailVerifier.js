"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const verifyEmailVerifier = async (req, res, next) => {
    try {
        const verifyCode = req.body.verifyCode;
        const user = await user_model_1.default.findOne({ verificationCode: verifyCode });
        if (user) {
            const tokenExpirationTime = user.verificationCode_expiration;
            if (Date.now() > Number(tokenExpirationTime)) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Token has expired" });
            }
            next();
        }
        else {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid token" });
        }
    }
    catch (error) {
        return res.status(400).json({ success: false, msg: error });
    }
};
exports.default = verifyEmailVerifier;
//# sourceMappingURL=verifyEmailVerifier.js.map