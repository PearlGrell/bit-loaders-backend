import { NextFunction, Request, Response } from "express";
import { client } from "../database/index";
import { StatusError } from "../middlewares/error.middleware";
import UserModel from "../models/user.model";
import { sign } from "../helpers/token.helper";
import { sign as passwordSign } from "../helpers/password.helper";
import respond from "../middlewares/response.middleware";
import { sendMail } from "../services/send_mail";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function getUsers(req: Request, res: Response, next: NextFunction) {
    try{

        const {limit, offset} = req.query;

        const users = await client.user.findMany({
            omit:{
                password: true,
                salt: true
            },
            where: {
                name: {
                    contains: req.query.name as string,
                    mode: "insensitive"
                },
                email: {
                    contains: req.query.email as string,
                    mode: "insensitive"
                }
            },
            skip: Number(offset) || undefined,
            take: Number(limit) || undefined
        });

        if(limit)

        if(users.length === 0){
            return next(new StatusError(404, "Users not found"))
        }

        return respond({
            message: "Users found",
            status_code: 200,
            label: "users",
            data: users
        }, res);
    } catch(error){
        next(error);
    }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const user = await client.user.findUnique({
            where: { id },
            omit: {
                password: true,
                salt: true
            }
        });

        if (!user) {
            return next(new StatusError(404, "User not found"));
        }

        return respond({
            message: "User found",
            status_code: 200,
            label: "user",
            data: user
        }, res);
    } catch (error) {
        next(error);
    }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return next(new StatusError(400, `Missing required fields: ${!name ? "name" : !email ? "email" : "password"}`));
        }

        if (!emailRegex.test(email)) {
            return next(new StatusError(400, "Invalid email format"));
        }

        if (password.length < 8) {
            return next(new StatusError(400, "Password must be at least 8 characters long"));
        }

        const exists = await client.user.findUnique({ where: { email } });
        if (exists) {
            return next(new StatusError(400, "User already exists"))
        }

        const user = new UserModel({ name, email, password });

        await client.user.create({
            data: user.toJSON()
        });

        const token = sign(user.id!);

        return respond({
            message: "User created successfully",
            status_code: 201,
            label: "authtoken",
            data: token
        }, res);
    } catch (error) {
        next(error);
    }
}


export async function loginUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new StatusError(400, `Missing required fields: ${!email ? "email" : "password"}`));
        }

        if (!emailRegex.test(email)) {
            return next(new StatusError(400, "Invalid email format"));
        }

        const _user = await client.user.findFirst({ where: { email } });

        if (!_user) {
            return next(new StatusError(404, "User not found"));
        }

        const user = new UserModel({
            id: _user.id,
            name: _user.name,
            email: _user.email,
            password: _user.password,
            salt: _user.salt,
            phone: _user.phone,
            createdAt: _user.created_at,
            updatedAt: _user.updated_at
        });

        if (user.loginUser(password) === true) {
            const token = sign(user.id!);
            return respond({
                message: "User logged in successfully",
                status_code: 200,
                label: "authtoken",
                data: token
            }, res);
        } else {
            return next(new StatusError(401, "Incorrect Password"));
        }
    } catch (error) {
        next(error);
    }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
    try{
        const { email } = req.body;

        if (!email) {
            return next(new StatusError(400, "Email is required"));
        }

        const user = await client.user.findUnique({ where: { email } });
        if (!user) {
            return next(new StatusError(404, "User not found"));
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = Number(otp);

        await sendMail({
            to: user.email,
            template: "forgot_password",
            firstname: user.name,
            otp: otp
        });

        user.updated_at = new Date();
        await client.user.update({
            where: { id: user.id },
            data: user
        });

        return respond({
            message: "OTP sent to your email",
            status_code: 200
        }, res);
    }
    catch(error){
        next(error);
    }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try{
        const id = req.params.id;
        const { otp, password } = req.body;
        if (!otp || !password) {
            return next(new StatusError(400, `Missing required fields: ${!otp ? "otp" : "password"}`));
        }

        if (password.length < 8) {
            return next(new StatusError(400, "Password must be at least 8 characters long"));
        }

        const user = await client.user.findUnique({ where: { id } });
        if (!user) {
            return next(new StatusError(404, "User not found"));
        }

        if (user.otp !== Number(otp)) {
            return next(new StatusError(400, "Invalid OTP"));
        }

        [user.salt, user.password] = passwordSign(password);
        user.otp = null;
        
        user.updated_at = new Date();

        await client.user.update({
            where: { id },
            data: user
        });

        return respond({
            message: "Password reset successfully",
            status_code: 200
        }, res);
    }
    catch(error){
        next(error);
    }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
    try {
        const {name, email, phone} = req.body;
        const id = req.params.id;

        const user = await client.user.findUnique({ where: { id } });
        if (!user) {
            return next(new StatusError(404, "User not found"));
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;

        user.updated_at = new Date();

        if (email && !emailRegex.test(email)) {
            return next(new StatusError(400, "Invalid email format"));
        }

        if (phone && phone.length < 10) {
            return next(new StatusError(400, "Invalid phone number format"));
        }

        await client.user.update({
            where: { id },
            data: user
        });

        return respond({
            message: "User updated successfully",
            status_code: 200,
            label: "user",
            data: user
        }, res);
    }
    catch (error) {
        next(error);
    }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;

        const user = await client.user.findUnique({ where: { id } });
        if (!user) {
            return next(new StatusError(404, "User not found"));
        }

        await client.user.delete({ where: { id } });

        return respond({
            message: "User deleted successfully",
            status_code: 200,
            label: "user",
            data: user
        }, res);
    }
    catch (error) {
        next(error);
    }
}
