import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../enums/HttpStatusCode";

export const errorHandler = (error: Error, req:Request, res:Response, next:NextFunction) => {
    console.error('Error', error.message);

    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message  || 'An unexpected error occured'
    })
}