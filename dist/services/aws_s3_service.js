"use strict";
// // services/s3Service.ts
// import { S3Client, PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
// import { v4 as uuidv4 } from "uuid";
// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables
// // Configure the S3 client
// const s3Client = new S3Client({
//   region: process.env.AWS_REGION || '', // AWS region
//   credentials: {
//     accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID || '', // Your AWS Access Key ID
//     secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY || '', // Your AWS Secret Access Key
//   },
// });
// // Type definition for the upload parameters
// interface UploadImageParams {
//   fileBuffer: Buffer; // File buffer received from the frontend
//   fileName: string; // Original file name for extracting the extension
//   bucketName: string; // S3 bucket name
// }
// /**
//  * Uploads an image to AWS S3 and returns the URL of the uploaded image.
//  * @param {UploadImageParams} params - Upload parameters including file buffer, file name, and bucket name.
//  * @returns {Promise<string>} - Resolves with the URL of the uploaded image if successful.
//  */
// export const uploadImageToS3 = async ({ fileBuffer, fileName, bucketName }: UploadImageParams): Promise<string> => {
//   const uniqueFileName = `${uuidv4()}${path.extname(fileName)}`; // Generate a unique file name
//   const params = {
//     Bucket: bucketName,
//     Key: uniqueFileName,
//     Body: fileBuffer,
//     ContentType: 'image/jpeg', // Change as necessary, e.g., 'image/png'
//     ACL: 'public-read', // Set the object to be publicly readable
//   };
//   try {
//     // Upload the file to S3
//     const command = new PutObjectCommand(params);
//     await s3Client.send(command);
//     // Return the generated URL of the uploaded image
//     return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFileName}`;
//   } catch (error: any) {
//     throw new Error(`Failed to upload image: ${error.message}`);
//   }
// };
//# sourceMappingURL=aws_s3_service.js.map