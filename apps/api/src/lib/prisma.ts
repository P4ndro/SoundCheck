import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const CONNECTION_ERROR_CODES = new Set(["P1001", "P1002", "P1017", "P2024"]);

export function isPrismaConnectionError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    CONNECTION_ERROR_CODES.has(error.code)
  );
}

export async function withDbRetry<T>(
  operation: () => Promise<T>,
  retries = 1,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (!isPrismaConnectionError(error) || attempt === retries) {
        throw error;
      }
      await prisma.$disconnect().catch(() => undefined);
      await prisma.$connect();
    }
  }

  throw lastError;
}
