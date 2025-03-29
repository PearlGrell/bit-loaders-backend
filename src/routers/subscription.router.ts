import { Router } from "express";
import AuthMiddleware from "../middlewares/auth.middleware";
import { addSubscription, deleteSubscription, getSharedSubscriptions, getSubscription, getSubscriptions, shareSubscription, updateSubscription } from "../controllers/subscription.router";

const subscriptionRouter = Router();

subscriptionRouter.get('/', AuthMiddleware, getSubscriptions);
subscriptionRouter.get('/:sub_id', AuthMiddleware, getSubscription);
subscriptionRouter.get('/shared', AuthMiddleware, getSharedSubscriptions);

subscriptionRouter.post('/', AuthMiddleware, addSubscription);
subscriptionRouter.post('/:sub_id/share', AuthMiddleware, shareSubscription);

subscriptionRouter.put('/:sub_id', AuthMiddleware, updateSubscription);

subscriptionRouter.delete('/:sub_id', AuthMiddleware, deleteSubscription);

export default subscriptionRouter;