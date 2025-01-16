import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../../infrastructure/database/repository/UserRepository";
import { UserUseCases } from "../../../application/use-cases/UserUseCase";
import { ResponseHandler } from "../../../utils/ResponseHandler";
import { HttpStatusCode } from "../../../enums/HttpStatusCode";
import { Messages } from "../../../constants/Messages";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwtUtils";
import { accessTokenOptions, refreshTokenOptions } from "../../../config/jwtOptions";
import { sendOTPUseCase } from "../../../application/use-cases/sendOtpUseCase";
import { verifyOtp } from "../../../infrastructure/services/otpService";
import { verifyOtpUseCase } from "../../../application/use-cases/verifyOtpUseCase";
import { config } from "../../../config/config";

const userRepository = new UserRepository();
const userUseCase = new UserUseCases(userRepository)

export const registerUserController = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const {email, phone , password} = req.body;
        if(!email || !phone || !password) {
            throw new Error('All input required')
        }
        const user = await userUseCase.registerUser(email, phone, password);
        const accessToken = generateAccessToken( {id : user._id})
        const refreshToken = generateRefreshToken({id: user._id})

        res.cookie('accessToken', accessToken, accessTokenOptions )
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)

       return ResponseHandler.sendResponse(
        res, 
        HttpStatusCode.CREATED,
        true,
        Messages.REGISTER_SUCCESS,
        {user, accessToken}
       )
    } catch (error:any) {
       next(error)
    }
}


export const loginUserController = async(req:Request, res: Response, next: NextFunction) => {
    try {
        const {email, password } = req.body;
        console.log(email, password)
        if(!email || !password) {
            throw new Error('Input required')
        }
        const user = await userUseCase.loginUser(email, password);
        
        if(user){
            const accessToken = generateAccessToken( {id : user._id})
        const refreshToken = generateRefreshToken({id: user._id})

        res.cookie('accessToken', accessToken, accessTokenOptions )
        res.cookie('refreshToken', refreshToken, refreshTokenOptions)
            ResponseHandler.sendResponse(res, HttpStatusCode.OK, true, Messages.LOGIN_SUCCESS, {user, accessToken})
        }else{
            ResponseHandler.sendResponse(res, HttpStatusCode.UNAUTHORIZED, false, Messages.INVALID_CREDENTIALS, )
        }
    } catch (error:any) {
       next(error)
    }
}

export const resetPasswordController = async (req:Request, res: Response, next : NextFunction) => {
    try {
        const {email, otp, newPassword} = req.body;
        await verifyOtpUseCase(email, otp)

        const updatedUser = await userUseCase.resetPasswordByOtp(email, newPassword)
        if(!updatedUser){
            throw new Error('Failed to updated password');
        }
        ResponseHandler.sendResponse(res, HttpStatusCode.OK, true, Messages.PASSWORD_UPDATED, updatedUser)
    } catch (error) {
        next(error)
    }
}

export const sendOtpController = async (req: Request, res: Response, next:NextFunction) => {
    try {
      const { email } = req.body;
      //sent otp
      const sentOTP = await sendOTPUseCase(email);
      console.log("sentOtp controller", sentOTP);
      ResponseHandler.sendResponse(res, HttpStatusCode.OK, true, Messages.OTP_SEND)
    } catch (error: any) {
      next(error)
    }
  };

  export const verifyOtpController = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;;
      const response = await verifyOtp(email, otp);
      res.status(200).json(response);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
      console.error(error);
    }
  };

  export const logoutController = async (req: Request, res: Response) => {
    try {
        res.clearCookie("accessToken", { httpOnly: true, 
            sameSite: config.app.ENVIRONMENT === 'production' ? "none" : "strict", 
            secure: config.app.ENVIRONMENT === 'production' });
          res.clearCookie("refreshToken", { httpOnly: true, 
            sameSite: config.app.ENVIRONMENT === 'production' ? "none" : "strict", 
            secure: config.app.ENVIRONMENT === 'production' });

            console.log('user logged out successfully')
            ResponseHandler.sendResponse(res, HttpStatusCode.OK,true, Messages.LOGGEDOUT,)
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
      console.error(error);
    }
  };