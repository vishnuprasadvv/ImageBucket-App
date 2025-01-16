import mongoose from "mongoose";
import { config } from "../../config/config";

export const connectDB = async ()=> {
    try {
        await mongoose.connect(config.mongodb.URI! as string)
        console.log('MongoDB connected successfully')
    } catch (error) {
        console.error('Database connection error', error)
    }
}