"use strict";
// // services/emailService.ts
// import { SESClient, SendEmailCommand, SendEmailCommandOutput } from '@aws-sdk/client-ses'; // Specific imports for SES
// import dotenv from 'dotenv';
// dotenv.config(); // Load environment variables
// // Configure SES client with credentials and region
// const sesClient = new SESClient({
//   region: process.env.AWS_REGION || '', // Fallback to an empty string if AWS_REGION is not defined
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID || '', // Fallback to an empty string if AWS_ACCESS_KEY_ID is not defined
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '', // Fallback to an empty string if AWS_SECRET_ACCESS_KEY is not defined
//   },
// });
// // Type definition for the sendEmail function parameters
// interface SendEmailParams {
//   to: string;
//   subject: string;
//   message: string;
// }
// /**
//  * Sends an email using AWS SES.
//  * @param {SendEmailParams} params - Email parameters including to, subject, and message.
//  * @returns {Promise<SendEmailCommandOutput>} - Resolves with the AWS SES response if the email is sent successfully, otherwise rejects with an error.
//  */
// export const sendEmail = async ({ to, subject, message }: SendEmailParams): Promise<SendEmailCommandOutput> => {
//   const params = {
//     Source: process.env.FROM_EMAIL || '', // Your verified email in AWS SES
//     Destination: {
//       ToAddresses: [to],
//     },
//     Message: {
//       Subject: {
//         Data: subject,
//         Charset: 'UTF-8',
//       },
//       Body: {
//         Text: {
//           Data: message,
//           Charset: 'UTF-8',
//         },
//        // Optional HTML body for forgot password email
// Html: {
//     Data: `
//       <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
//         <h2 style="color: #2c3e50;">Password Reset Request</h2>
//         <p>Dear User,</p>
//         <p>We received a request to reset your password. Click the link below to create a new password:</p>
//         <p>
//           <a href="https://yourwebsite.com/reset-password?token=YOUR_TOKEN" 
//              style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
//              Reset Password
//           </a>
//         </p>
//         <p>If you did not request this, please ignore this email.</p>
//         <p>Thank you!</p>
//         <p>Best regards,<br>Your Company Name</p>
//       </div>`,
//     Charset: 'UTF-8',
//   },
//       },
//     },
//   };
//   try {
//     // Create and send the email command
//     const command = new SendEmailCommand(params);
//     const result = await sesClient.send(command);
//     return result;
//   } catch (error: any) {
//     throw new Error(`Failed to send email: ${error.message}`);
//   }
// };
//# sourceMappingURL=aws_email_service.js.map