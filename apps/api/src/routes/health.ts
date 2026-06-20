import { env } from "../config/env.js";
import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "soundcheck-api",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});
