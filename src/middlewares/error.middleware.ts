import { NextFunction, Request, Response } from "express";
import { settings } from "../config/settings";

export class StatusError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string){
        super(message);
        this.statusCode = statusCode;
    }
}

export default function ErrorMiddleware(err: any, req: Request, res: Response, next: NextFunction){
    console.log(`Error encountered: ${err}`);
    const message = err.message || "Internal Server Error";
    const status_code = err.statusCode || 500;  
    res.status(status_code).send({
        "status": false,
        message,
        "error_stack": settings.environment == "DEV" ? err.stack || {}: {}
    });
}