import { Request, Response, NextFunction } from "express";
import { client } from "../database/index";
import { StatusError } from "../middlewares/error.middleware";
import SubscriptionModel from "../models/subscription.model";
import respond from "../middlewares/response.middleware";

export async function getSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        
        const subscriptions = await client.subscription.findMany({
            where: { user_id },
        });
        return respond({
            message: "Subscriptions retrieved successfully",
            status_code: 200,
            data: subscriptions,
            label: "subscriptions",
        }, res);
    }
    catch (error) {
        next(error);
    }
}

export async function getSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        const subscription_id = req.params.sub_id;

        if(!user_id || !subscription_id) {
            throw new StatusError(400, "User ID and Subscription ID are required");
        }

        const subscription = await client.subscription.findUnique({
            where: { id: subscription_id },
        });
        
        if (!subscription) {
            throw new StatusError(404, "Subscription not found");
        }

        return respond({
            message: "Subscription retrieved successfully",
            status_code: 200,
            data: subscription,
            label: "subscription",
        }, res);
    }
    catch (error) {
        next(error);
    }
}

export async function getSharedSubscriptions(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        
        const subscriptions = await client.subscription.findMany({
            where: { shared_with: {
                contains: user_id,
                mode: "insensitive"
            } },
        });
        return respond({
            message: "Shared subscriptions retrieved successfully",
            status_code: 200,
            data: subscriptions,
            label: "subscriptions",
        }, res);
    }
    catch (error) {
        next(error);
    }
}

export async function addSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        const {
            name,
            provider,
            category,
            amount,
            billing_cycle,
            renewal_date,
            auto_renewal,
            trial,
            shared_with
        } = req.body;

        if(!user_id) {
            throw new StatusError(400, "User ID is required");
        }
        if(!name || !category || !amount || !billing_cycle || !renewal_date) {
            throw new StatusError(400, "All fields are required");
        }
        if (!["MONTHLY", "YEARLY", "WEEKLY", "ONE_TIME"].includes(billing_cycle)) {
            throw new StatusError(400, "Billing cycle must be either monthly or yearly");
        }
        if (amount <= 0) {
            throw new StatusError(400, "Amount must be greater than 0");
        }
        if (new Date(renewal_date) < new Date()) {
            throw new StatusError(400, "Renewal date must be in the future");
        }
        if (trial && shared_with) {
            throw new StatusError(400, "Trial subscriptions cannot be shared with others");
        }
        const subscription = new SubscriptionModel({
            user_id,
            name,
            provider,
            category,
            amount,
            billing_cycle,
            renewal_date,
            auto_renewal,
            trial,
            shared_with,
        });

        await client.subscription.create({
            data: subscription
        });

        return respond({
            message: "Subscription added successfully",
            status_code: 201,
        }, res);
    }
    catch (error) {
        next(error);
    }
}

export async function shareSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        const subscription_id = req.params.sub_id;

        if (!user_id || !subscription_id) {
            throw new StatusError(400, "User ID and Subscription ID are required");
        }

        const subscription = await client.subscription.findUnique({
            where: { id: subscription_id },
        });

        if (!subscription) {
            throw new StatusError(404, "Subscription not found");
        }

        let sharedWithArray = subscription.shared_with
            ? subscription.shared_with.split(";").filter(Boolean)
            : [];

        if (sharedWithArray.includes(user_id)) {
            throw new StatusError(400, "User is already in shared list");
        }

        sharedWithArray.push(user_id);
        const updatedSharedWith = sharedWithArray.join(";");

        await client.subscription.update({
            where: { id: subscription_id },
            data: { shared_with: updatedSharedWith }
        });

        return respond({
            message: "Subscription shared successfully",
            status_code: 200,
            data: { shared_with: updatedSharedWith }
        }, res);
    } catch (error) {
        next(error);
    }
}


export async function updateSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        const subscription_id = req.params.sub_id;
        const {
            name,
            provider,
            category,
            amount,
            billing_cycle,
            renewal_date,
            auto_renewal,
            trial,
            shared_with
        } = req.body;

        if(!user_id || !subscription_id) {
            throw new StatusError(400, "User ID and Subscription ID are required");
        }

        const subscription = await client.subscription.findUnique({
            where: { id: subscription_id },
        });
        
        if (!subscription) {
            throw new StatusError(404, "Subscription not found");
        }

        await client.subscription.update({
            where: { id: subscription_id },
            data: {
                name,
                provider,
                category,
                amount,
                billing_cycle,
                renewal_date,
                auto_renewal,
                trial,
                shared_with
            }
        });

        return respond({
            message: "Subscription updated successfully",
            status_code: 200
        }, res);
    }
    catch (error) {
        next(error);
    }
}

export async function deleteSubscription(req: Request, res: Response, next: NextFunction) {
    try {
        const user_id = req.params.id;
        const subscription_id = req.params.sub_id;

        if(!user_id || !subscription_id) {
            throw new StatusError(400, "User ID and Subscription ID are required");
        }

        const subscription = await client.subscription.findUnique({
            where: { id: subscription_id },
        });
        
        if (!subscription) {
            throw new StatusError(404, "Subscription not found");
        }

        await client.subscription.delete({
            where: { id: subscription_id },
        });

        return respond({
            message: "Subscription deleted successfully",
            status_code: 200
        }, res);
    }
    catch (error) {
        next(error);
    }
}