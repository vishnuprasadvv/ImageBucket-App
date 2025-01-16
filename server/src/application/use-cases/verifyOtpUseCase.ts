import { verifyOtp } from "../../infrastructure/services/otpService"

export const verifyOtpUseCase  = async (email: string, otp:string) => {
    const isValid = await verifyOtp(email, otp)
    if(!isValid) {
        throw new Error('Invalid or expired OTP')
    }
    
   
    return {message: 'OTP verified successfully'}
}