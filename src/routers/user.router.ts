import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { createUser, deleteUser, forgotPassword, getUser, getUsers, loginUser, resetPassword, updateUser } from "../controllers/user.controller";

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/current', AuthMiddleware, getUser);
userRouter.get('/:id', getUser);

userRouter.post('/', createUser);
userRouter.post('/login', loginUser);
userRouter.post('/forgot', forgotPassword)
userRouter.post('/reset', AuthMiddleware ,resetPassword);

userRouter.put('/', AuthMiddleware, updateUser);

userRouter.delete('/', AuthMiddleware, deleteUser);

export default userRouter;