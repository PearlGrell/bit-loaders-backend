"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../middlewares/auth.middleware"));
const user_controller_1 = require("../controllers/user.controller");
const userRouter = (0, express_1.Router)();
userRouter.get('/', user_controller_1.getUsers);
userRouter.get('/current', auth_middleware_1.default, user_controller_1.getUser);
userRouter.get('/:id', user_controller_1.getUser);
userRouter.post('/', user_controller_1.createUser);
userRouter.post('/login', user_controller_1.loginUser);
userRouter.post('/forgot', user_controller_1.forgotPassword);
userRouter.post('/reset', auth_middleware_1.default, user_controller_1.resetPassword);
userRouter.put('/', auth_middleware_1.default, user_controller_1.updateUser);
userRouter.delete('/', auth_middleware_1.default, user_controller_1.deleteUser);
exports.default = userRouter;
//# sourceMappingURL=user.router.js.map