import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../utils/jwtUtils";
import { UserRepository } from "../../infrastructure/database/repository/UserRepository";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
const userRepository = new UserRepository()

export const isAuthenticated = async (req:Request, res:Response, next: NextFunction) => {
    const accessToken = req.cookies?.accessToken;
    // const refreshToken = req.cookies?.refreshToken;
    console.log('accesstoken', accessToken)


    if(!accessToken) {
        res.status(401).json({message: 'accessToken expired'})
        return;
    }

    try {
        const decode = verifyAccessToken(accessToken);
        if(!decode){ 
            res.status(401).json({message: 'Invalid accessToken'});
            return;
        }
        
        const user = await userRepository.findById(decode.id)

        if(!user) {
            res.status(404).json({message: 'User not authorized'})
            return;
        }
        req.user = {
            id: user._id.toString()
        }
        next();
        
    } catch (error) {

        console.log('isAuthenticated error', error)

        if(error instanceof TokenExpiredError){
            res.status(401).json({message: 'accessToken expired'})
        }else if(error instanceof JsonWebTokenError) {
            res.status(401).json({message: 'Invalid accessToken'})
        }else{
            res.status(401).json({message: 'Invalid accessToken'})
        }
    }
}