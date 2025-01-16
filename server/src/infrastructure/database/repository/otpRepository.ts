import { IOtpRepository } from "../../../application/interfaces/IOtpRepository";
import { OtpModel } from "../models/OtpModel";

export class OtpRepository implements IOtpRepository{
    async generateOtp(email: string, otp: string, expiresAt: Date): Promise<void> {
        await OtpModel.deleteMany({email})
        await OtpModel.create({email, otp, expiresAt})
    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const otpRecord = await OtpModel.findOne({email, otp, expiresAt : { $gte: new Date()}})
        return !! otpRecord;
    }
}