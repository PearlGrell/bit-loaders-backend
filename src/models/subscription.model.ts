import { BillingCycle, SubscriptionCategory } from "../types";

interface Subscription {
    id: string;
    user_id: string;
    name: string;
    provider: string | null;
    category: SubscriptionCategory;
    amount: number;
    billing_cycle: BillingCycle;
    renewal_date: Date;
    auto_renewal: boolean;
    trial: boolean;
    shared_with: string | null;
    created_at: Date;
    updated_at: Date;
}

class SubscriptionModel implements Subscription{
    id: string;
    user_id: string;
    name: string;
    provider: string | null;
    category: SubscriptionCategory;
    amount: number;
    billing_cycle: BillingCycle;
    renewal_date: Date;
    auto_renewal: boolean;
    trial: boolean;
    shared_with: string | null;
    created_at: Date;
    updated_at: Date;

    constructor(subscription: Partial<Subscription>) {
        this.id = subscription.id ?? crypto.randomUUID();
        this.user_id = subscription.user_id;
        this.name = subscription.name;
        this.provider = subscription.provider;
        this.category = subscription.category;
        this.amount = subscription.amount;
        this.billing_cycle = subscription.billing_cycle;
        this.renewal_date = subscription.renewal_date;
        this.auto_renewal = subscription.auto_renewal ?? true;
        this.trial = subscription.trial ?? false;
        this.shared_with = subscription.shared_with ?? this.user_id;
        this.created_at = subscription.created_at ?? new Date();
        this.updated_at = subscription.updated_at ?? new Date();
    }

    toJSON() {
        return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            provider: this.provider,
            category: this.category,
            amount: this.amount,
            billing_cycle: this.billing_cycle,
            renewal_date: this.renewal_date,
            auto_renewal: this.auto_renewal,
            trial: this.trial,
            shared_with: this.shared_with,
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }
}

export default SubscriptionModel;