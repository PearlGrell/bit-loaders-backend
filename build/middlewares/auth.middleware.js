"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AuthMiddleware;
const error_middleware_1 = require("./error.middleware");
const token_helper_1 = require("../helpers/token.helper");
function AuthMiddleware(req, res, next) {
    try {
        const auth = req.headers['authorization'];
        const token = auth === null || auth === void 0 ? void 0 : auth.split(" ")[1];
        if (!token) {
            return next(new error_middleware_1.StatusError(401, "Unauthorized: No token provided"));
        }
        const id = (0, token_helper_1.unsign)(token);
        req.params.id = id;
        next();
    }
    catch (error) {
        next(error);
    }
}
;
//# sourceMappingURL=auth.middleware.js.map