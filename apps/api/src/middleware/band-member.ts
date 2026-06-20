import { ApiError } from "./error-handler.js";
import { prisma } from "../lib/prisma.js";
import { bandIdFromRequest } from "../lib/request-params.js";
import type { BandMember } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      bandId?: string;
      bandMembership?: BandMember;
    }
  }
}

export function requireBandMember() {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const bandId = bandIdFromRequest(req);

      if (!bandId) {
        next(new ApiError(400, "Band ID is required"));
        return;
      }

      if (!req.dbUser) {
        next(new ApiError(401, "Authentication required"));
        return;
      }

      const membership = await prisma.bandMember.findUnique({
        where: {
          userId_bandId: {
            userId: req.dbUser.id,
            bandId,
          },
        },
      });

      if (!membership) {
        next(new ApiError(403, "You are not a member of this band"));
        return;
      }

      req.bandId = bandId;
      req.bandMembership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
}
