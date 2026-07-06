process.env.NODE_ENV = "test";
process.env.DATABASE_URL ??=
  "postgresql://test:test@localhost:5432/soundcheck_test";
process.env.CLERK_SECRET_KEY ??= "sk_test_soundcheck";
process.env.CLERK_PUBLISHABLE_KEY ??= "pk_test_soundcheck";
process.env.CORS_ORIGIN ??= "http://localhost:5173";
