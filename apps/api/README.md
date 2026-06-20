# Soundcheck API

Express + TypeScript + Prisma + Clerk backend.

## Setup

```bash
cp .env.example .env
# Fill DATABASE_URL, CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY

npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Runs at `http://localhost:3001`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo band (The Marlowe) |
| `npm run db:studio` | Open Prisma Studio |

## Authentication

Protected routes require a Clerk session JWT:

```http
Authorization: Bearer <clerk_session_token>
```

On first sign-in, the API upserts a `User` row. If your Clerk email matches a seeded member (`alex@example.com`, etc.), you are linked to the demo band automatically.

## Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| GET | `/api/me` | Yes | Current user + band memberships |
| GET | `/api/bands/:bandId/workspace` | Yes + member | Full workspace payload |
| GET | `/api/bands/:bandId/songs` | Yes + member | List songs |
| GET | `/api/bands/:bandId/songs/:songId` | Yes + member | Get song |
| POST | `/api/bands/:bandId/songs` | Yes + member | Create song |
| PATCH | `/api/bands/:bandId/songs/:songId` | Yes + member | Update song |
| DELETE | `/api/bands/:bandId/songs/:songId` | Yes + member | Delete song |

## Security

- Helmet + CORS (single origin)
- Clerk JWT verification on protected routes
- Band membership check on all `:bandId` routes
- Zod validation on request bodies and params
- No secrets in repo — `.env` is gitignored

## Environment

See `.env.example`. Required:

- `DATABASE_URL` — Neon pooled PostgreSQL URL
- `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY`

Optional (chat uploads, later):

- `CLOUDINARY_*`
