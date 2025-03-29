import { Router } from "express";
import userRouter from "./routers/user.router";
import subscriptionRouter from "./routers/subscription.router";

const router = Router();

router.use('/users', userRouter);
router.use('/subscriptions', subscriptionRouter);

export default router