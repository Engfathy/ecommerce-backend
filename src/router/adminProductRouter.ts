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
import multer from "multer";


const upload = multer();
const adminProductRouter: express.Router = express.Router();
adminProductRouter.post('/upload-product', upload.array('images', 10))

export default adminProductRouter;