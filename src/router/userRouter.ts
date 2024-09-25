import express from "express";
import jwtTokenVerifier from "../middleware/jwtTokenVerifier";
import { body, validationResult } from "express-validator";
import {
    loginUser,
    // forgetPassword,
    // getUserData,
    // refreshToken,
    // resetPassword,
    registerUser,
    
} from "../controller/user.controller";

import resetTokenVerifier from "../middleware/resetTokenVerifier";

// let upload = multer();
const userRouter: express.Router = express.Router();

// userRouter.use(upload.array());
userRouter.get("/", (req: express.Request, res: express.Response) => {
    res.status(200).json({
        msg: "main router for users",
    });
});
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


// userRouter.get("/profile", jwtTokenVerifier, getUserData);

// // userRouter.post("/logout", logoutUser);

// userRouter.post(
//     "/forget-password",
//     [body("email").isEmail().escape().withMessage("email is not valid")],

//     forgetPassword,
// );

// userRouter.post(
//     "/reset-password",
//     [
//         body("password")
//             .isLength({ min: 5 })
//             .escape()
//             .withMessage("min 5 characters required for password"),
//     ],

//     resetTokenVerifier,
//     resetPassword,
// );
// userRouter.post(
//     "/refresh-token",
//     refreshToken,
// );

export default userRouter;
