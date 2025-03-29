"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const settings_1 = require("./config/settings");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const router_1 = __importDefault(require("./router"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)(settings_1.settings.cors));
app.use(express_1.default.static("public"));
app.use(settings_1.settings.api_prefix, router_1.default);
app.use(error_middleware_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map