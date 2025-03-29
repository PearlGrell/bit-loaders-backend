import { pbkdf2Sync, randomBytes } from "node:crypto";

export function sign(password: string) {
    const salt = randomBytes(16).toString("base64");
    const hash = pbkdf2Sync(password, salt, 1000, 16, "sha512").toString("base64");
    return [salt, hash];
}

export function verify_password(password: string, salt: string, hash: string){
    const _hash = pbkdf2Sync(password, salt, 1000, 16, "sha512").toString("base64");
    return _hash === hash;
}
