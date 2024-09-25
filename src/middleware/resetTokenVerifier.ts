import express from "express";
import User from "../models/user.model";

const resetTokenVerifier = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
) => {
    try {
        const resetToken  = req.body.token;
        const user = await User.findOne({ reset_token: resetToken });

        if (user) {
            const tokenExpirationTime = user.reset_token_expiration;
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

export default resetTokenVerifier;
