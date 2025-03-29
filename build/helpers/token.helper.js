"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.unsign = unsign;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const settings_1 = require("../config/settings");
function sign(id) {
    const token = jsonwebtoken_1.default.sign({ id }, settings_1.settings.auth.JWT_SECRET, {
        algorithm: "HS256"
    });
    return token;
}
function unsign(token) {
    const id = jsonwebtoken_1.default.verify(token, settings_1.settings.auth.JWT_SECRET, {
        algorithms: ['HS256']
    });
    return id['id'];
}
//# sourceMappingURL=token.helper.js.map