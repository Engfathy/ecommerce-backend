"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const gravatar_1 = __importDefault(require("gravatar"));
const user_model_1 = __importDefault(require("../models/user.model"));
const express_validator_1 = require("express-validator");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./../env.env" });
const isProduction = () => process.env.ENVIRONMENT !== 'development';
const registerUser = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    try {
        let { firstName, lastName, email, password } = req.body;
        let user = await user_model_1.default.findOne({ email: email });
        if (user) {
            return res
                .status(400)
                .json({ success: false, msg: "Email already exist" });
        }
        //check if user name is used
        // encrypt password
        let salt = await bcryptjs_1.default.genSalt(10);
        let hashPass = await bcryptjs_1.default.hash(password, salt);
        //get avatar url
        const default_avatar = gravatar_1.default.url(email, {
            s: "300",
            r: "pg",
            d: "mm",
        });
        // register user
        user = new user_model_1.default({
            firstName: firstName.toLowerCase(),
            lastName: lastName.toLowerCase(),
            email: email,
            role: 'customer',
            password: hashPass,
            default_avatar,
        });
        user = await user.save();
        const secretKey = process.env.JWT_SECRET_KEY;
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
        const access_expirationTime = Math.floor(Date.now() / 1000) + 3 * 60 * 60; // 3 hour from now
        const refresh_expirationTime = Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jsonwebtoken_1.default.sign({ exp: access_expirationTime, payLoad }, secretKey);
        const refresh_token = jsonwebtoken_1.default.sign({ exp: refresh_expirationTime, payLoad }, secretKey);
        res.header("access_token", access_token);
        res.header("refresh_token", refresh_token);
        // Set the token as an HTTP-only cookie
        // Access Token Cookie
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        // User Info Cookies (firstName and lastName)
        res.cookie("firstName", user.firstName, {
            secure: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        res.cookie("lastName", user.lastName, {
            secure: true,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        // User ID Cookie
        res.cookie("userId", user.id, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        return res.status(200).json({
            success: true,
            msg: "Registration is sucess",
            refresh_token: refresh_token,
            token: access_token,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, msg: error });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ success: false, errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = await user_model_1.default.findOne({
            email: email
        });
        console.log(user);
        if (!user) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, msg: "Invalid email or password" });
        }
        const secretKey = process.env.JWT_SECRET_KEY;
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
        const access_expirationTime = Math.floor(Date.now() / 1000) + 3 * 60 * 60; // 3 hour from now
        const refresh_expirationTime = Math.floor(Date.now() / 1000) + 10 * 24 * 60 * 60; // 10 days from now
        const access_token = jsonwebtoken_1.default.sign({ exp: access_expirationTime, payLoad }, secretKey);
        const refresh_token = jsonwebtoken_1.default.sign({ exp: refresh_expirationTime, payLoad }, secretKey);
        res.header("access_token", access_token);
        res.header("refresh_token", refresh_token);
        console.log(process.env.ENVIRONMENT);
        const isProduction = process.env.ENVIRONMENT !== "development";
        // Set the access token cookie
        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "strict",
            maxAge: 2 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        // Set first name cookie
        res.cookie("firstName", user.firstName, {
            secure: isProduction,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        // Set last name cookie
        res.cookie("lastName", user.lastName, {
            secure: isProduction,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        // Set user ID cookie
        res.cookie("userId", user.id, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000,
            path: "/",
        });
        console.log("logged");
        const user_data = await user_model_1.default.findOne({
            $and: [{ _id: user.id }, { email: user.email }],
        }).select("-password -reset_token  -reset_token_expiration ");
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
            userData: user_data
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, msg: error });
    }
};
exports.loginUser = loginUser;
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
//# sourceMappingURL=user.controller.js.map