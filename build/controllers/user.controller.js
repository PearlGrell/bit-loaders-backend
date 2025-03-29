"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.createUser = createUser;
exports.loginUser = loginUser;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const index_1 = require("../database/index");
const error_middleware_1 = require("../middlewares/error.middleware");
const user_model_1 = __importDefault(require("../models/user.model"));
const token_helper_1 = require("../helpers/token.helper");
const password_helper_1 = require("../helpers/password.helper");
const response_middleware_1 = __importDefault(require("../middlewares/response.middleware"));
const send_mail_1 = require("../services/send_mail");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function getUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { limit, offset } = req.query;
            const users = yield index_1.client.user.findMany({
                omit: {
                    password: true,
                    salt: true
                },
                where: {
                    name: {
                        contains: req.query.name,
                        mode: "insensitive"
                    },
                    email: {
                        contains: req.query.email,
                        mode: "insensitive"
                    }
                },
                skip: Number(offset) || undefined,
                take: Number(limit) || undefined
            });
            if (limit)
                if (users.length === 0) {
                    return next(new error_middleware_1.StatusError(404, "Users not found"));
                }
            return (0, response_middleware_1.default)({
                message: "Users found",
                status_code: 200,
                label: "users",
                data: users
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
function getUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield index_1.client.user.findUnique({
                where: { id },
                omit: {
                    password: true,
                    salt: true
                }
            });
            if (!user) {
                return next(new error_middleware_1.StatusError(404, "User not found"));
            }
            return (0, response_middleware_1.default)({
                message: "User found",
                status_code: 200,
                label: "user",
                data: user
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
function createUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return next(new error_middleware_1.StatusError(400, `Missing required fields: ${!name ? "name" : !email ? "email" : "password"}`));
            }
            if (!emailRegex.test(email)) {
                return next(new error_middleware_1.StatusError(400, "Invalid email format"));
            }
            if (password.length < 8) {
                return next(new error_middleware_1.StatusError(400, "Password must be at least 8 characters long"));
            }
            const exists = yield index_1.client.user.findUnique({ where: { email } });
            if (exists) {
                return next(new error_middleware_1.StatusError(400, "User already exists"));
            }
            const user = new user_model_1.default({ name, email, password });
            yield index_1.client.user.create({
                data: user.toJSON()
            });
            const token = (0, token_helper_1.sign)(user.id);
            return (0, response_middleware_1.default)({
                message: "User created successfully",
                status_code: 201,
                label: "authtoken",
                data: token
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
function loginUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return next(new error_middleware_1.StatusError(400, `Missing required fields: ${!email ? "email" : "password"}`));
            }
            if (!emailRegex.test(email)) {
                return next(new error_middleware_1.StatusError(400, "Invalid email format"));
            }
            const _user = yield index_1.client.user.findFirst({ where: { email } });
            if (!_user) {
                return next(new error_middleware_1.StatusError(404, "User not found"));
            }
            const user = new user_model_1.default({
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
                const token = (0, token_helper_1.sign)(user.id);
                return (0, response_middleware_1.default)({
                    message: "User logged in successfully",
                    status_code: 200,
                    label: "authtoken",
                    data: token
                }, res);
            }
            else {
                return next(new error_middleware_1.StatusError(401, "Incorrect Password"));
            }
        }
        catch (error) {
            next(error);
        }
    });
}
function forgotPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            if (!email) {
                return next(new error_middleware_1.StatusError(400, "Email is required"));
            }
            const user = yield index_1.client.user.findUnique({ where: { email } });
            if (!user) {
                return next(new error_middleware_1.StatusError(404, "User not found"));
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = Number(otp);
            yield (0, send_mail_1.sendMail)({
                to: user.email,
                template: "forgot_password",
                firstname: user.name,
                otp: otp
            });
            user.updated_at = new Date();
            yield index_1.client.user.update({
                where: { id: user.id },
                data: user
            });
            return (0, response_middleware_1.default)({
                message: "OTP sent to your email",
                status_code: 200
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
function resetPassword(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const { otp, password } = req.body;
            if (!otp || !password) {
                return next(new error_middleware_1.StatusError(400, `Missing required fields: ${!otp ? "otp" : "password"}`));
            }
            if (password.length < 8) {
                return next(new error_middleware_1.StatusError(400, "Password must be at least 8 characters long"));
            }
            const user = yield index_1.client.user.findUnique({ where: { id } });
            if (!user) {
                return next(new error_middleware_1.StatusError(404, "User not found"));
            }
            if (user.otp !== Number(otp)) {
                return next(new error_middleware_1.StatusError(400, "Invalid OTP"));
            }
            [user.salt, user.password] = (0, password_helper_1.sign)(password);
            user.otp = null;
            user.updated_at = new Date();
            yield index_1.client.user.update({
                where: { id },
                data: user
            });
            return (0, response_middleware_1.default)({
                message: "Password reset successfully",
                status_code: 200
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
function updateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { name, email, phone } = req.body;
            const id = req.params.id;
            const user = yield index_1.client.user.findUnique({ where: { id } });
            if (!user) {
                return next(new error_middleware_1.StatusError(404, "User not found"));
            }
            if (name)
                user.name = name;
            if (email)
                user.email = email;
            if (phone)
                user.phone = phone;
            user.updated_at = new Date();
            if (email && !emailRegex.test(email)) {
                return next(new error_middleware_1.StatusError(400, "Invalid email format"));
            }
            if (phone && phone.length < 10) {
                return next(new error_middleware_1.StatusError(400, "Invalid phone number format"));
            }
            yield index_1.client.user.update({
                where: { id },
                data: user
            });
            return (0, response_middleware_1.default)({
                message: "User updated successfully",
                status_code: 200,
                label: "user",
                data: user
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
function deleteUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const user = yield index_1.client.user.findUnique({ where: { id } });
            if (!user) {
                return next(new error_middleware_1.StatusError(404, "User not found"));
            }
            yield index_1.client.user.delete({ where: { id } });
            return (0, response_middleware_1.default)({
                message: "User deleted successfully",
                status_code: 200,
                label: "user",
                data: user
            }, res);
        }
        catch (error) {
            next(error);
        }
    });
}
//# sourceMappingURL=user.controller.js.map