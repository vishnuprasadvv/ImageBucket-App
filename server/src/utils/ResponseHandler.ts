import { Response } from "express";

export class ResponseHandler{
    static sendResponse(
        res:Response, 
        statusCode:number,
        success: boolean,
        message: string,
        data: any = null
    ){
        res.status(statusCode).json({
            success, 
            message,
            data
        })
    }
}