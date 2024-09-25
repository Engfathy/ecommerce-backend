import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import User from "../models/user.model";
import express from "express";
import { validationResult } from "express-validator";

import { generateRandomString } from "../utils/randomString";
import * as crypto from "crypto";
import dotEnv from "dotenv";

dotEnv.config({ path: "./../env.env" });
const isProduction = () => process.env.ENVIRONMENT !== 'development';

export const registerUser = async (
    req: express.Request,
    res: express.Response,
) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        let { firstName,lastName,email, password } = req.body;

        let user: User | null = await User.findOne({ email: email });
        if (user) {
            return res
                .status(400)
                .json({ success: false, msg: "Email already exist" });
        }
        //check if user name is used

        // encrypt password
        let salt = await bcrypt.genSalt(10);
        let hashPass = await bcrypt.hash(password, salt);

        //get avatar url
        const default_avatar = gravatar.url(email, {
            s: "300",
            r: "pg",
            d: "mm",
        });
        // register user
        user = new User({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            email: email,
            role: 'customer',
            password: hashPass,
            default_avatar,
        });
        user = await user.save();
        const secretKey: string | undefined =
            process.env.JWT_SECRET_KEY ;
        if (!secretKey) {
            return res
                .status(500)
                .json({ success: false, msg: "JWT secret key not available" });
        }

        const payLoad = {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        };
        const access_expirationTime =
            Math.floor(Date.now() / 1000) + 3 * 60 * 60; // 3 hour from now
        const refresh_expirationTime =
            Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jwt.sign(
            { exp: access_expirationTime, payLoad },
            secretKey,
        );
        const refresh_token = jwt.sign(
            { exp: refresh_expirationTime, payLoad },
            secretKey,
        );

        res.header("access_token", access_token);
        res.header("refresh_token", refresh_token);

        // Set the token as an HTTP-only cookie

     // Access Token Cookie
res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
    path: "/",
});

// User Info Cookies (firstName and lastName)
res.cookie("firstName", user.firstName, {
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
});

res.cookie("lastName", user.lastName, {
    secure: true,
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
});

// User ID Cookie
res.cookie("userId", user.id, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: "/",
});
        return res.status(200).json({
            success: true,
            msg: "Registration is sucess",
            refresh_token: refresh_token,
            token: access_token,
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error });
    }
};

export const loginUser = async (
    req: express.Request,
    res: express.Response,
) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, errors: errors.array() });
        }
        const { email, password } = req.body;
        const user: User | null = await User.findOne({
            email: email
        });
        console.log(user);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }

        const isMatch: boolean = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }

        const secretKey: string | undefined =
            process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            return res
                .status(500)
                .json({ success: false, msg: "JWT secret key not available" });
        }

        const payLoad = {
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
            },
        };

        const access_expirationTime =
            Math.floor(Date.now() / 1000) + 3 * 60 * 60; // 3 hour from now
        const refresh_expirationTime =
            Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jwt.sign(
            { exp: access_expirationTime, payLoad },
            secretKey,
        );
        const refresh_token = jwt.sign(
            { exp: refresh_expirationTime, payLoad },
            secretKey,
        );

        res.header("access_token", access_token);
        res.header("refresh_token", refresh_token);
            console.log(process.env.ENVIRONMENT)
        const isProduction = process.env.ENVIRONMENT !== "development";

        // Set the access token cookie
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: isProduction, // Secure set to true in production, false in development
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days in milliseconds
            path: "/",
        });
        
        // Set first name cookie
        res.cookie("firstName", user.firstName, {
            secure: isProduction, // Secure set based on environment
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
        });
        
        // Set last name cookie
        res.cookie("lastName", user.lastName, {
            secure: isProduction, // Secure set based on environment
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
        });
        
        // Set user ID cookie
        res.cookie("userId", user.id, {
            httpOnly: true,
            secure: isProduction, // Secure set based on environment
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            path: "/",
        });

        console.log("logged");
        const user_data = await User.findOne({
            $and: [{ _id: user.id }, { email: user.email }],
        }).select(
            "-password -reset_token  -reset_token_expiration ",
        );
        if (!user_data) {
            return res
                .status(401)
                .json({ success: false, msg: "User data not found." });
        }
        return res.status(200).json({
            success: true,
            msg: "Login is successful",
            token: access_token,
            refresh_token: refresh_token,
            userData:user_data
        });
    } catch (error) {
        return res.status(500).json({ success: false, msg: error });
    }
};

// export const getUserData = async (
//     req: express.Request,
//     res: express.Response,
// ) => {
//     try {
//         const userName = req.cookies["userName"] || req.headers["user"];
//         const userId = req.cookies["userId"] || req.headers["id"];
//         console.log(userName, userId);

//         if (!userName || !userId) {
//             return res
//                 .status(400)
//                 .json({ success: false, msg: "User headers are missing." });
//         }

//         const user = await User.findOne({
//             $or: [{ _id: userId }, { name: userName }],
//         }).select(
//             "-password -reset_token -verificationCode -reset_token_expiration -verificationCode_expiration",
//         );
//         if (!user) {
//             return res
//                 .status(401)
//                 .json({ success: false, msg: "User data not found." });
//         }

//         return res.status(200).json({
//             msg: {
//                 user: user,
//             },
//         });
//     } catch (error) {
//         return res
//             .status(500)
//             .json({ success: false, msg: "Error fetching user data." });
//     }
// };

// //-------------------------------------------------------


// //--------------------------------------------------
// export const forgetPassword = async (
//     req: express.Request,
//     res: express.Response,
// ) => {
//     try {
//         const { email } = req.body;
//         const user: User | null = await User.findOne({ email: email });

//         if (user) {
//             const tokenExpirationTime = Date.now() + 180000; // 3 minutes from now
//             const resetToken = crypto.randomInt(10000, 99999).toString();
//             console.log(tokenExpirationTime);
//             // Update the user's reset token in the database
//             const setToken = await User.updateOne(
//                 { email: email },
//                 {
//                     $set: {
//                         reset_token: resetToken,
//                         reset_token_expiration: tokenExpirationTime,
//                     },
//                 },
//             );
            

//             return res.status(200).json({
//                 success: true,
//                 msg: "Please check your inbox for resetting your password.",
//             });
//         } else {
//             return res
//                 .status(400)
//                 .json({ success: false, msg: "This email doesn't exist" });
//         }
//     } catch (error) {
//         return res.status(400).json({ success: false, msg: error });
//     }
// };

// export const resetPassword = async (
//     req: express.Request,
//     res: express.Response,
// ) => {
//     try {
//         const newPassword = req.body.password;
//         const token: string | any = req.body.token;
//         if (!newPassword || !token) {
//             return res
//                 .status(400)
//                 .json({ success: false, msg: "data hasn't send propably" });
//         }
//         const user: User | null = await User.findOne({ reset_token: token });
//         if (user) {
//             const salt = await bcrypt.genSalt(10);
//             const newHashPass = await bcrypt.hash(newPassword, salt);
//             await User.findByIdAndUpdate(
//                 { _id: user._id },
//                 {
//                     $set: {
//                         password: newHashPass,
//                         reset_token: "",
//                         reset_token_expiration: "",
//                     },
//                 },
//                 { new: true },
//             );
//             return res.status(200).json({
//                 success: true,
//                 msg: "Password reset successful",
//             });
//         } else {
//             return res.status(200).json({
//                 success: false,
//                 msg: "This token time has expired or is invalid",
//             });
//         }
//     } catch (error) {
//         return res.status(500).json({ success: false, msg: error });
//     }
// };


// export const refreshToken = async (
//     req: express.Request,
//     res: express.Response,
// ) => {
//     const refresh_token = req.body.refreshToken;

//     if (!refreshToken) {
//         return res.status(400).json({
//             success: false,
//             message: "Refresh token is missing.",
//         });
//     }
//     const secretKey: string | any =
//         process.env.JWT_SECRET_KEY ;
//     let decode: any;

//     try {
//         decode = jwt.verify(refresh_token, secretKey);
//         const payLoad = {
//             user: {
//                 googleId: decode["payLoad"]["user"].googleId
//                     ? decode["payLoad"]["user"].googleId
//                     : "",
//                 id: decode["payLoad"]["user"].name,
//                 name: decode["payLoad"]["user"].name,
//             },
//         };
//         // decode["payLoad"]["user"].name
//         const access_expirationTime =
//             Math.floor(Date.now() / 1000) + 1 * 60 * 60; // 1 hour from now
//         const new_access_token = jwt.sign(
//             { exp: access_expirationTime, payLoad },
//             secretKey,
//         );

//         res.header("new_access_token", new_access_token);
//         return res.status(200).json({
//             success: true,
//             new_access_token: new_access_token,
//         });
//     } catch (error) {
//         return res.status(401).json({
//             success: false,
//             msg: "Ops something went wrong",
//         });
//     }
// };
