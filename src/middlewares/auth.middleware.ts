import { Request, Response, NextFunction } from "express";
import { StatusError } from "./error.middleware";
import { unsign } from "../helpers/token.helper";

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try{
        const auth = req.headers['authorization'];
        const token = auth?.split(" ")[1];

        if(!token){
            return next(new StatusError(401, "Unauthorized: No token provided"));
        }

        const id = unsign(token);

        req.params.id = id;
        next();
    } catch(error){
        next(error);
    }
};