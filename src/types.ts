import { CorsOptions } from "cors";

export type Settings = {
      appname: string;
      environment: string;
      api_prefix: string;
      server: {
            port: number;
            apiPrefix: string;
      };
      cors: CorsOptions,
      auth: {
            JWT_SECRET: string;
      };
      mail: {
            host: string;
            port: number;
            auth: {
                  user: string;
                  pass: string;
            };
      };
};

enum BillingCycle {
      MONTHLY = 'MONTHLY',
      YEARLY = 'YEARLY',
      WEEKLY = 'WEEKLY',
      ONE_TIME = 'ONE_TIME'
}

enum PaymentStatus {
      SUCCESS = 'SUCCESS',
      FAILED = 'FAILED',
      PENDING = 'PENDING'
}

enum AlertType {
      RENEWAL_REMINDER = 'RENEWAL_REMINDER',
      PAYMENT_DUE = 'PAYMENT_DUE',
      PRICE_INCREASE = 'PRICE_INCREASE',
      TRIAL_EXPIRY = 'TRIAL_EXPIRY'
}

enum SubscriptionCategory {
      STREAMING = 'STREAMING',
      PRODUCTIVITY = 'PRODUCTIVITY',
      SAAS = 'SAAS',
      CLOUD_STORAGE = 'CLOUD_STORAGE',
      GAMING = 'GAMING',
      OTHER = 'OTHER'
}

export { BillingCycle, PaymentStatus, AlertType, SubscriptionCategory };