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

// export const uploadProduct = async (
//     req: express.Request,
//     res: express.Response,
// ) => {
//     try {
//         const { name, price, description, category, ...otherData } = req.body as ProductData; // Extract fields from the request body
    
//         // Check if images are included in the request
//         if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
//           return res.status(400).json({ success: false, message: 'No images uploaded.' });
//         }
    
//         // Validate required product data fields
//         if (!name || !price || !description) {
//           return res.status(400).json({ success: false, message: 'Missing required product information.' });
//         }
    
//         const bucketName = process.env.AWS_S3_BUCKET_NAME || ''; // AWS S3 bucket name from environment variables
    
//         // Array to hold URLs of uploaded images
//         const imageUrls: string[] = [];
    
//         // Upload each image to S3
//         for (const file of req.files as Express.Multer.File[]) {
//           const imageUrl = await uploadImageToS3({
//             fileBuffer: file.buffer,
//             fileName: file.originalname,
//             bucketName,
//           });
//           imageUrls.push(imageUrl); // Add the image URL to the array
//         }
    
//         // Create a new product document with the received data and the S3 image URLs
//         const newProduct = new Product({
//           name,
//           price,
//           description,
//           category,
//           images: imageUrls, // Store the array of image URLs
//           ...otherData, // Spread any additional data received in the request body
//         });
    
//         // Save the new product to the database
//         await newProduct.save();
    
//         return res.status(200).json({
//           success: true,
//           message: 'Product uploaded successfully with multiple images.',
//           product: newProduct,
//         });
//       } catch (error: any) {
//         return res.status(500).json({ success: false, message: error.message });
//       }
// };