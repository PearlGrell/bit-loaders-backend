"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = respond;
function respond(response, res) {
    const _response = {
        status: true,
        message: response.message,
    };
    if (response.data !== undefined) {
        _response[response.label || "data"] = response.data;
    }
    res.status(response.status_code).json(_response);
}
//# sourceMappingURL=response.middleware.js.map