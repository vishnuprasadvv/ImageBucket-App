import api from "../axios/userInterceptor"
import { config } from "../config/config"

const API_URL = config.app.BASE_URL

export const loginUserApi = async(email:string, password: string) => {
    const response = await api.post(`${API_URL}/api/users/login`, {email, password})
    return response.data;
}
export const signupUserApi = async(email:string,phone: string, password: string, confirmPassword : string) => {
    const response = await api.post(`${API_URL}/api/users/register`, {email, phone, password, confirmPassword})
    return response.data;
}
export const resetPasswordApi = async( email: string, otp:string, newPassword : string) => {
    const response = await api.patch(`${API_URL}/api/users/reset-password`, { email, otp, newPassword})
    return response.data;
}
export const sendOtpApi = async( email:string) => {
    const response = await api.post(`${API_URL}/api/users/send-otp`, {email})
    return response.data;
}
export const logoutApi = async() => {
    const response = await api.post(`${API_URL}/api/users/logout`)
    return response.data;
}