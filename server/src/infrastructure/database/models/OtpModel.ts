import mongoose, { Schema } from "mongoose";

const OtpSchema = new Schema({
    email: {type: String, required: true},
    otp: {type: String, required: true},
    expiresAt: {type: String, required: true},
})

export const OtpModel = mongoose.model('Otp', OtpSchema)