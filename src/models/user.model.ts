import { body } from "express-validator";
import mongoose, { Document, Schema } from "mongoose";

export interface Address {
    firstName: string;
    lastName: string;
    company: string;
    country: string;
    province: string;
    city: string;
    street: string;
    address: string;
    postalCode: string;
    phone: string;
}
interface User extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'customer' | 'admin';
    password: string;
    address:Address[];
    default_avatar: string;
    user_avatar: string;
    verificationCode: string;
    verificationCode_expiration: string;
    verified?: boolean;
    reset_token: string;
    reset_token_expiration: string;
    createdAt?: Date;
    updatedAt?: Date;
}
const AddressSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    company: { type: String },
    country: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    phone: { type: String, required: true },
  });
// Define the user schema
const userSchema: Schema = new mongoose.Schema<User>(
    {
        email: { type: String, required: true, unique: true },
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        password: { type: String },
        role: { required:true,type: String, enum: ['customer', 'admin'], default: 'customer' },
        address:[AddressSchema],
        default_avatar: { type: String, required: true },
        user_avatar: { type: String ,default:""},
        verificationCode: { type: String, default: "" },
        verificationCode_expiration: { type: String, default: "" },
        verified: { type: Boolean, default: false },
        reset_token: { type: String, default: "" },
        reset_token_expiration: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }, 
);

// Create the User model
const User = mongoose.model<User>("User", userSchema);

export default User;
