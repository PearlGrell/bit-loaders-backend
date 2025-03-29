import express from "express";
import cors from "cors";
import { settings } from "./config/settings";
import ErrorMiddleware from "./middlewares/error.middleware";
import router from "./router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(settings.cors));
app.use(express.static("public"));

app.use(settings.api_prefix, router);

app.use(ErrorMiddleware);

export default app;
