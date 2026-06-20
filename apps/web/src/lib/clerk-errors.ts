import { isClerkAPIResponseError } from "@clerk/clerk-react/errors";

export function clerkErrorMessage(error: unknown, fallback: string): string {
  if (isClerkAPIResponseError(error)) {
    return (
      error.errors[0]?.longMessage ??
      error.errors[0]?.message ??
      fallback
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
