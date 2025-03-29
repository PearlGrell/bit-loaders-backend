"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusError = void 0;
exports.default = ErrorMiddleware;
const settings_1 = require("../config/settings");
class StatusError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.StatusError = StatusError;
function ErrorMiddleware(err, req, res, next) {
    console.log(`Error encountered: ${err}`);
    const message = err.message || "Internal Server Error";
    const status_code = err.statusCode || 500;
    res.status(status_code).send({
        "status": false,
        message,
        "error_stack": settings_1.settings.environment == "DEV" ? err.stack || {} : {}
    });
}
//# sourceMappingURL=error.middleware.js.map