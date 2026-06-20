const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

if (!clerkPublishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY. Copy apps/web/.env.example to .env.local and add your Clerk publishable key.",
  );
}

export const env = {
  clerkPublishableKey,
  apiUrl: apiUrl.replace(/\/$/, ""),
} as const;
