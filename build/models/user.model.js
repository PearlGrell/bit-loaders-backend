"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_helper_1 = require("../helpers/password.helper");
const error_middleware_1 = require("../middlewares/error.middleware");
class UserModel {
    constructor(user) {
        this.id = user.id || crypto.randomUUID();
        this.name = user.name;
        this.email = user.email || "";
        if (user.salt && user.password) {
            this.salt = user.salt;
            this.password = user.password;
        }
        else if (user.password) {
            [this.salt, this.password] = (0, password_helper_1.sign)(user.password);
        }
        else {
            throw new error_middleware_1.StatusError(409, "Password cannot be undefined");
        }
        this.otp = user.otp;
        this.phone = user.phone;
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = user.updatedAt || new Date();
    }
    loginUser(pswd) {
        if (this.salt && this.password) {
            return (0, password_helper_1.verify_password)(pswd, this.salt, this.password);
        }
        else {
            throw new error_middleware_1.StatusError(409, "Password cannot be undefined");
        }
    }
    toJSON() {
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
exports.default = UserModel;
//# sourceMappingURL=user.model.js.map