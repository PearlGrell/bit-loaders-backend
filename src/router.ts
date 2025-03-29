import { Router } from "express";
import userRouter from "./routers/user.router";

const router = Router();

router.use('/user', userRouter);

export default router