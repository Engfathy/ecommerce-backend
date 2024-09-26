import express from "express";
import User from "../models/user.model";

const verifyEmailVerifier = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const verifyCode  = req.body.verifyCode;
        const user = await User.findOne({ verificationCode:verifyCode });

        if (user) {
            const tokenExpirationTime = user.verificationCode_expiration;
            if (Date.now() > Number(tokenExpirationTime)) {
                return res
                    .status(400)
                    .json({ success: false, msg: "Token has expired" });
            }
            next();
        } else {
            return res
                .status(400)
                .json({ success: false, msg: "Invalid token" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, msg: error });
    }
};

export default verifyEmailVerifier;
