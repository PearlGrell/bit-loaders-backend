import { Settings } from "../types";
import dotenv from "dotenv";

dotenv.config();

export const settings : Settings = {
    appname: process.env.APP_NAME!,
    environment: process.env.ENV!,
    api_prefix: process.env.API_PREFIX!,
    cors: {
        origin: '*',
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    },
    server: {
        port: parseInt(process.env.PORT!),
        apiPrefix: process.env.API_PREFIX!
    },
    auth: {
        JWT_SECRET: process.env.JWT_SECRET!
    },
    mail: {
        host: process.env.SMTP_HOST!,
        port: parseInt(process.env.SMTP_PORT!),
        auth: {
            user: process.env.SMTP_USER!,
            pass: process.env.SMTP_PASS!
        }
    }
};