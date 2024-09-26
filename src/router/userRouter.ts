import express from "express";
import jwtTokenVerifier from "../middleware/jwtTokenVerifier";
import { body, validationResult } from "express-validator";
import {
    loginUser,
    forgetPassword,
    getUserData,
    refreshToken,
    resetPassword,
    registerUser,
    verifyEmail,
    sendVerificationEmail,
    
} from "../controller/user.controller";

import resetTokenVerifier from "../middleware/resetTokenVerifier";
import verifyEmailVerifier from "../middleware/verifyEmailVerifier";

// let upload = multer();
const userRouter: express.Router = express.Router();

// userRouter.use(upload.array());
userRouter.post(
    "/register",
    [
        body("firstName").not().isEmpty().escape().withMessage("firstName is required"),
        body("lastName").not().isEmpty().escape().withMessage("lastName is required"),
        body("email").isEmail().escape().withMessage("email isnot valid"),
        body("password")
            .isLength({ min: 8, max: 20 })
            .escape()
            .withMessage("min 8 , max 20 char required for password"),
    ],
    registerUser,
);

userRouter.post(
    "/login",
    [
        body("email").isEmail().escape().withMessage("email is not valid"),
        body("password")
            .isLength({ min: 5 })
            .escape()
            .withMessage("min 5 characters required for password"),
    ],
    loginUser,
);


userRouter.get("/profile", jwtTokenVerifier, getUserData);
userRouter.post(
    "/sendEmail-verify",
    [body("email").isEmail().escape().withMessage("email is not valid")],

    sendVerificationEmail,
);
userRouter.post(
    "/verify-email",
    [body("email").isEmail().escape().withMessage("email is not valid")],

    verifyEmailVerifier,
    verifyEmail,
);

// // userRouter.post("/logout", logoutUser);

userRouter.post(
    "/forget-password",
    [body("email").isEmail().escape().withMessage("email is not valid")],

    forgetPassword,
);

userRouter.post(
    "/reset-password",
    [
        body("password")
            .isLength({ min: 5 })
            .escape()
            .withMessage("min 5 characters required for password"),
        body("token")
            .isLength({ max: 5 })
            .escape()
            .withMessage("token lenght invalid"),
    ],

    resetTokenVerifier,
    resetPassword,
);
userRouter.post(
    "/refresh-token",
    refreshToken,
);

export default userRouter;
