"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtTokenVerifier = (req, res, next) => {
    try {
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer", ""); // Retrieve token from the HTTP-only cookie
        if (!token) {
            return res.status(401).json({
                msg: "No token provided. Access denied.",
            });
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        let decode;
        try {
            decode = jsonwebtoken_1.default.verify(token, secretKey);
            if (Date.now() >= decode.exp * 1000) {
                return res.status(401).json({
                    msg: "Token expired. Access denied.",
                });
            }
        }
        catch (error) {
            return res.status(401).json({
                msg: "Token verification failed. Access denied.",
            });
        }
        req.headers["user"] = decode["payLoad"]["user"].name;
        req.headers["id"] = decode["payLoad"]["user"].id;
        // console.log(req.headers)
        next();
    }
    catch (error) {
        return res.status(501).json({
            msg: "Internal server error.",
        });
    }
};
exports.default = jwtTokenVerifier;
//# sourceMappingURL=jwtTokenVerifier.js.map