import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { ApiError } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";
import { handleClerkWebhook } from "./routes/webhooks/clerk.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import express from "express";
import helmet from "helmet";

export interface CreateAppOptions {
  skipClerk?: boolean;
}

export function createApp(options: CreateAppOptions = {}) {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    }),
  );

  app.post(
    "/api/webhooks/clerk",
    express.raw({ type: "application/json", limit: "256kb" }),
    handleClerkWebhook,
  );

  app.use(express.json({ limit: "1mb" }));

  if (!options.skipClerk) {
    app.use(
      clerkMiddleware({
        publishableKey: env.CLERK_PUBLISHABLE_KEY,
        secretKey: env.CLERK_SECRET_KEY,
      }),
    );
  }

  app.use("/api", apiRouter);

  app.use((_req, _res, next) => {
    next(new ApiError(404, "Route not found"));
  });

  app.use(errorHandler);

  return app;
}

