import jwt, { JwtPayload } from 'jsonwebtoken';
import { settings } from '../config/settings';

export function sign(id: string){
    const token = jwt.sign({ id },settings.auth.JWT_SECRET,{
        algorithm: "HS256"
    });
    return token;
}

export function unsign(token: string){
    const id = jwt.verify(token, settings.auth.JWT_SECRET, {
        algorithms: ['HS256']
    }) as JwtPayload;
    return id['id'];
}