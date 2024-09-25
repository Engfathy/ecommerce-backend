"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const user_controller_1 = require("../controller/user.controller");
// let upload = multer();
const userRouter = express_1.default.Router();
// userRouter.use(upload.array());
userRouter.get("/", (req, res) => {
    res.status(200).json({
        msg: "main router for users",
    });
});
userRouter.post("/register", [
    (0, express_validator_1.body)("firstName").not().isEmpty().escape().withMessage("firstName is required"),
    (0, express_validator_1.body)("lastName").not().isEmpty().escape().withMessage("lastName is required"),
    (0, express_validator_1.body)("email").isEmail().escape().withMessage("email isnot valid"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 8, max: 20 })
        .escape()
        .withMessage("min 8 , max 20 char required for password"),
], user_controller_1.registerUser);
userRouter.post("/login", [
    (0, express_validator_1.body)("email").isEmail().escape().withMessage("email is not valid"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 5 })
        .escape()
        .withMessage("min 5 characters required for password"),
], user_controller_1.loginUser);
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
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map