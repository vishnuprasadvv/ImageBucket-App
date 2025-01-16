import { UserRepository } from "../../infrastructure/database/repository/UserRepository";
import { sendEmail } from "../../infrastructure/services/emailService";
import { generateOtp } from "../../infrastructure/services/otpService";
const userRepository = new UserRepository()
export const sendOTPUseCase = async (email: string) => {
    const user = await userRepository.findByEmail(email)
    if(!user){
        throw new Error('User not registered with the given email')
    }
    const otpCode = await generateOtp(email);
    await sendEmail(email, 'Your OTP code', `Your OTP code is ${otpCode}`)
    return otpCode;
}