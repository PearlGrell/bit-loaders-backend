import { sign, verify_password } from "../helpers/password.helper";
import { StatusError } from "../middlewares/error.middleware";

interface iUser {
    id: string;
    name: string | undefined;
    email: string;
    password: string;
    salt?: string | undefined;
    phone?: string | undefined;
    otp?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;
}

class UserModel implements iUser{
    id: string;
    name: string | undefined;
    email: string;
    password: string;
    salt?: string | undefined;
    phone?: string | undefined;
    otp?: string | undefined;
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;

    constructor(user: Partial<iUser>){
        this.id = user.id || crypto.randomUUID();
        this.name = user.name;
        this.email = user.email || "";
        if (user.salt && user.password) {
            this.salt = user.salt;
            this.password = user.password;
        } else if (user.password) {
            [this.salt, this.password] = sign(user.password);
        } else {
            throw new StatusError(409, "Password cannot be undefined");
        }
        this.otp = user.otp;
        this.phone = user.phone;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }

    loginUser(pswd:string){
        if(this.salt && this.password){
            return verify_password(pswd, this.salt, this.password);
        }
        else {
            throw new StatusError(409, "Password cannot be undefined");
        }
    }

    toJSON(){
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            salt: this.salt,
            phone: this.phone,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        };
    }
}

export default UserModel;