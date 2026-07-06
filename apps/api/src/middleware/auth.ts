import { requireEnv } from "../config/env.js";
import { ApiError } from "../middleware/error-handler.js";
import { prisma, withDbRetry } from "../lib/prisma.js";
import { createClerkClient } from "@clerk/backend";
import { getAuth } from "@clerk/express";
import type { User } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";

const clerkClient = createClerkClient({
  secretKey: requireEnv("CLERK_SECRET_KEY"),
});

declare global {
  namespace Express {
    interface Request {
      dbUser?: User;
    }
  }
}

async function syncUserFromClerk(clerkId: string): Promise<User> {
  const clerkUser = await clerkClient.users.getUser(clerkId);
  const email = clerkUser.primaryEmailAddress?.emailAddress;

  if (!email) {
    throw new ApiError(400, "A verified email address is required");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
    email.split("@")[0] ||
    "Band member";

  const existingByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingByEmail) {
    if (existingByEmail.deletedAt) {
      throw new ApiError(401, "Account is no longer active");
    }

    return prisma.user.update({
      where: { id: existingByEmail.id },
      data: {
        clerkId,
        name,
        avatarUrl: clerkUser.imageUrl,
      },
    });
  }

  return prisma.user.create({
    data: {
      id: `user-${crypto.randomUUID().slice(0, 8)}`,
      clerkId,
      email,
      name,
      avatarUrl: clerkUser.imageUrl,
    },
  });
}

async function resolveTestUser(req: Request): Promise<User | null> {
  if (process.env.VITEST !== "true") {
    return null;
  }

  const testUserId = req.header("x-test-user-id");
  if (!testUserId) {
    return null;
  }

  const user = await prisma.user.findUnique({ where: { id: testUserId } });
  if (!user) {
    throw new ApiError(401, "Authentication required");
  }

  if (user.deletedAt) {
    throw new ApiError(401, "Account is no longer active");
  }

  return user;
}

export async function resolveDbUser(req: Request): Promise<User> {
  const testUser = await resolveTestUser(req);
  if (testUser) {
    return testUser;
  }

  if (process.env.VITEST === "true") {
    throw new ApiError(401, "Authentication required");
  }

  const { userId: clerkId } = getAuth(req);

  if (!clerkId) {
    throw new ApiError(401, "Authentication required");
  }

  const existingByClerk = await withDbRetry(() =>
    prisma.user.findUnique({ where: { clerkId } }),
  );

  if (existingByClerk) {
    if (existingByClerk.deletedAt) {
      throw new ApiError(401, "Account is no longer active");
    }
    return existingByClerk;
  }

  return syncUserFromClerk(clerkId);
}

export function requireAuth() {
  return asyncHandlerAttachUser;
}

async function asyncHandlerAttachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    req.dbUser = await resolveDbUser(req);
    next();
  } catch (error) {
    next(error);
  }
}

export { clerkClient };
