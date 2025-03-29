"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = sign;
exports.verify_password = verify_password;
const node_crypto_1 = require("node:crypto");
function sign(password) {
    const salt = (0, node_crypto_1.randomBytes)(16).toString("base64");
    const hash = (0, node_crypto_1.pbkdf2Sync)(password, salt, 1000, 16, "sha512").toString("base64");
    return [salt, hash];
}
function verify_password(password, salt, hash) {
    const _hash = (0, node_crypto_1.pbkdf2Sync)(password, salt, 1000, 16, "sha512").toString("base64");
    return _hash === hash;
}
//# sourceMappingURL=password.helper.js.map