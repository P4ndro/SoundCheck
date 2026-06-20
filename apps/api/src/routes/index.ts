import { bandsRouter } from "./bands/index.js";
import { healthRouter } from "./health.js";
import { meRouter } from "./me.js";
import { Router } from "express";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/me", meRouter);
apiRouter.use("/bands", bandsRouter);
