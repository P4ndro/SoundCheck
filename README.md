# Soundcheck

A collaborative workspace for bands — manage songs, setlists, rehearsals, instrument notation, and internal chat in one place.

Built as a university final project. The app runs on a real backend (Express, Prisma, Neon) with Clerk authentication and TanStack Query on the frontend.

**Repository:** [github.com/P4ndro/SoundCheck](https://github.com/P4ndro/SoundCheck)

---

## Features

| Module | What it does | Status |
|--------|----------------|--------|
| **Songs** | Library with status filters, kanban workflow, song detail (lyrics, BPM, key, notes) | Live API |
| **Setlists** | Create setlists, reorder songs, link to calendar events | Live API |
| **Calendar** | Month view for rehearsals, gigs, and meetings | Live API |
| **Chat** | Band group chat with text, photo uploads (Cloudinary), unread sidebar badge | Live API |
| **Tabs** | Role-based instrument view, ASCII tab / chord display | Workspace cache (dedicated API next) |
| **Settings** | Band info, member roster, invite codes / join links, multi-band switch | Live API |

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, React Router 7, TanStack Query |
| Styling | Tailwind CSS v4, custom design tokens |
| Build | Vite 6 |
| Auth | Clerk |
| API | Node.js, Express 5, Zod |
| Database | PostgreSQL (Neon), Prisma |
| Media | Cloudinary (chat photos) |
| Drag & drop | `@dnd-kit` (kanban, setlist reorder) |

---

## Getting started

**Requirements:** Node.js 20+

### 1. API

```bash
cd apps/api
cp .env.example .env
# Fill DATABASE_URL, CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY
# Optional: CLOUDINARY_* for chat photo uploads

npm install
npm run db:migrate
npm run db:seed    # optional demo data
npm run dev
```

API runs at [http://localhost:3001](http://localhost:3001).

### 2. Web

```bash
cd apps/web
cp .env.example .env.local
# Fill VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL=http://localhost:3001

npm install
npm run dev
```

App runs at [http://localhost:5173](http://localhost:5173).

Sign up with Clerk, complete profile onboarding, then create or join a band (invite link: `/join?code=...`).

### Scripts (web)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

### Scripts (api)

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run typecheck` | TypeScript check |
| `npm run db:migrate` | Apply Prisma migrations |
| `npm run db:seed` | Seed demo band |

---

## Project structure

```
SoundCheck/
├── apps/
│   ├── api/                  # Express API, Prisma, Clerk
│   │   ├── prisma/           # Schema, migrations, seed
│   │   └── src/
│   │       ├── routes/       # REST handlers
│   │       ├── lib/          # Services, serializers
│   │       └── middleware/   # Auth, validation, rate limits
│   └── web/                  # React frontend
│       └── src/
│           ├── app/          # Router and root layout
│           ├── components/   # Shared UI and layout
│           ├── features/     # Domain modules
│           ├── hooks/        # Data hooks (Query, chat, session)
│           ├── lib/          # Utilities, query keys, formatters
│           ├── providers/    # React context providers
│           ├── services/     # API client
│           └── types/        # TypeScript interfaces
└── docs/                     # Design system, architecture, roadmap
```

Path alias `@/` maps to `apps/web/src/`.

---

## Documentation

- [Design system](./docs/DESIGN.md) — tokens, typography, component patterns
- [Architecture](./docs/ARCHITECTURE.md) — folder conventions, data model, security
- [Roadmap](./docs/ROADMAP.md) — phased delivery
- [API readme](./apps/api/README.md) — routes and environment variables

---

## Current status

**Shipped**

- Clerk auth, profile + band onboarding, multi-band support
- Songs, setlists, calendar, member profiles — full API + UI
- Band invites (share code/link, rate-limited join)
- Chat (polling, image uploads, unread notifications)
- TanStack Query migration for session, workspace, and chat

**Next**

- Tabs API (read/write, role-based edit permissions) + workspace trim
- Production deploy (web + API + Clerk webhook)
- Optional: calendar event edit/delete in UI, WebSockets for chat

---

## Contributors

- [P4ndro](https://github.com/P4ndro)

---

## License

MIT — see [LICENSE](./LICENSE).
