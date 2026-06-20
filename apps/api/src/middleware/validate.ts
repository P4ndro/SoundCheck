import { ApiError } from "../middleware/error-handler.js";
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

type RequestTarget = "body" | "params" | "query";

export function validate<T>(
  schema: ZodSchema<T>,
  target: RequestTarget = "body",
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const message = result.error.errors
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      next(new ApiError(400, message));
      return;
    }

    req[target] = result.data as never;
    next();
  };
}
