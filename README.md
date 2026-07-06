# Soundcheck

A collaborative workspace for bands — songs, setlists, calendar, notation, and chat in one place.

University final project with a production-style stack: React frontend, Express API, PostgreSQL, and Clerk auth. **Staging is live** on Vercel + Render + Neon.

**Repository:** [github.com/P4ndro/SoundCheck](https://github.com/P4ndro/SoundCheck)

---

## What it does

- **Songs** — repertoire library with workflow status, lyrics, and metadata
- **Tabs** — role-based instrument notation (ASCII tab and chord charts)
- **Setlists** — ordered song lists for gigs and rehearsals
- **Calendar** — rehearsals, gigs, and meetings
- **Chat** — band group chat with photo sharing (polling; syncs across devices)
- **Band settings** — members, invite links, multi-band support

---

## Stack

| Layer | Tech |
|-------|------|
| Web | React, TypeScript, Vite, Tailwind, TanStack Query |
| API | Express, Prisma, Zod |
| Database | PostgreSQL (Neon) |
| Auth | Clerk |
| Media | Cloudinary (chat images) |

Monorepo: `apps/web` (frontend) and `apps/api` (backend).

---

## Hosting (staging)

| Service | Role |
|---------|------|
| **Vercel** | Web app (`apps/web`) |
| **Render** | API (`apps/api`) |
| **Neon** | Postgres — `staging` branch for staging, `production` for launch |
| **Clerk** | Auth — **Development** instance for staging (`pk_test_` / `sk_test_`) |

**Render API build command:**

```bash
npm ci --include=dev && npx prisma generate && npx prisma migrate deploy && npm run build
```

**Start command:** `npm start`

**Vercel:** set root directory to `apps/web`. Env: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_URL` (Render URL, no trailing slash). `vercel.json` rewrites all routes to `index.html` for React Router.

**After deploy:** set Render `CORS_ORIGIN` to your exact Vercel URL; add the same URL to Clerk allowed origins. Wake a sleeping free-tier API via `/api/health` before demos.

Full launch checklist: [docs/PRODUCTION.md](./docs/PRODUCTION.md)

---

## Quick start (local)

**Requirements:** Node.js 20+, Neon database, Clerk app (Development instance is fine)

### API

Copy `apps/api/.env.example` to `apps/api/.env`. Use your **staging** Neon pooled URL for local dev (not production).

```bash
cd apps/api
npm install
npx prisma migrate deploy   # or: npm run db:migrate for local schema dev
npm run dev
```

API: [http://localhost:3001](http://localhost:3001) · Health: [http://localhost:3001/api/health](http://localhost:3001/api/health)

### Web

Copy `apps/web/.env.example` to `apps/web/.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
```

```bash
cd apps/web
npm install
npm run dev
```

Web: [http://localhost:5173](http://localhost:5173)

Sign up, complete onboarding, then create or join a band (`/join?code=...`).

---

## Tests

```bash
cd apps/api && npm test                    # unit (no DB)
cd apps/api && npm run test:integration    # needs Postgres + migrate deploy
cd apps/web && npm test
```

CI runs on push/PR to `main` and `production-readiness`. Details: [docs/TESTING.md](./docs/TESTING.md)

---

## Project layout

```
SoundCheck/
├── apps/
│   ├── api/          Express API, Prisma, migrations
│   └── web/          React app (Vite)
├── docs/             Architecture, production roadmap, testing
├── render.yaml       Render API service config
└── vercel.json       SPA rewrites (monorepo fallback)
```

| Doc | Purpose |
|-----|---------|
| [PRODUCTION.md](./docs/PRODUCTION.md) | Launch roadmap and env checklist |
| [TESTING.md](./docs/TESTING.md) | Vitest and CI |
| [apps/api/README.md](./apps/api/README.md) | API routes and scripts |
| [DESIGN.md](./docs/DESIGN.md) | Product and UX notes |

---

## Contributors

- [P4ndro](https://github.com/P4ndro)

---

## License

MIT — see [LICENSE](./LICENSE).
