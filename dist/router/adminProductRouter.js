"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const adminProductRouter = express_1.default.Router();
adminProductRouter.post('/upload-product', upload.array('images', 10));
exports.default = adminProductRouter;
//# sourceMappingURL=adminProductRouter.js.map