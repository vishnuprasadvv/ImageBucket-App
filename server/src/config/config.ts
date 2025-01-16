 import dotenv from 'dotenv';
 dotenv.config();
 
 interface IApp{
    PORT : string
    ENVIRONMENT : string
}

interface ICors {
    CLIENT_URL : string;
    ALLOWED_HEADERS : string[];
    ALLOWED_METHODS : string[];
    CREDENTIALS : boolean;
}

interface IJwtConfig {
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRE?: string;
    REFRESH_TOKEN_EXPIRE?: string;
}

interface IMailer{
    EMAIL_PASS : string;
    EMAIL_USER: string;
}

 interface IConfig {
    app: IApp
    mongodb: IMongodb 
    cors: ICors
    jwt : IJwtConfig
    mailer: IMailer
}

interface IMongodb{
    URI: string | undefined
}

export const config:IConfig = {
    app: {
        PORT: process.env.PORT || "5000",
        ENVIRONMENT : process.env.ENVIRONMENT || 'development'
    },
    mongodb:{
        URI: process.env.MONGO_URI
    },
    cors: {
        CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
        ALLOWED_HEADERS : ['Content-Type', 'Authorization'],
        ALLOWED_METHODS : ["GET", "POST", "DELETE", "PUT","PATCH"],
        CREDENTIALS : true
    },

    jwt: {
        ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET || 'access secret',
        REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET || 'refresh secret',
        ACCESS_TOKEN_EXPIRE : process.env.ACCESS_TOKEN_EXPIRE,
        REFRESH_TOKEN_EXPIRE : process.env.REFRESH_TOKEN_EXPIRE,
    },
    mailer:{
        EMAIL_USER: process.env.EMAIL_USER!,
        EMAIL_PASS: process.env.EMAIL_PASS!
    }

}