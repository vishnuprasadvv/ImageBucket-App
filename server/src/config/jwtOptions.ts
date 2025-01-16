import { config } from "./config";

interface ITokenOptions {
    expires : Date,
    maxAge: number, 
    httpOnly: boolean,
    sameSite: 'strict' | 'none' | undefined;
    secure?: boolean;
}

const accessTokenExpire = parseInt(config.jwt.ACCESS_TOKEN_EXPIRE || '5')
const refreshTokenExpire = parseInt(config.jwt.REFRESH_TOKEN_EXPIRE || '1')

export const accessTokenOptions : ITokenOptions  = {
    expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
    maxAge: accessTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: config.app.ENVIRONMENT === 'production' ? 'none' : 'strict',
    secure: config.app.ENVIRONMENT === 'production'
}

export const refreshTokenOptions : ITokenOptions  = {
    expires: new Date(Date.now() + refreshTokenExpire * 60 * 60 * 1000),
    maxAge: refreshTokenExpire * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: config.app.ENVIRONMENT === 'production' ? 'none' : 'strict',
    secure: config.app.ENVIRONMENT === 'production'
}