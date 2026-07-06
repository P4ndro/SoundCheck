# Soundcheck

A collaborative workspace for bands — songs, setlists, calendar, notation, and chat in one place.

University final project with a production-style stack: React frontend, Express API, PostgreSQL, and Clerk auth.

**Repository:** [github.com/P4ndro/SoundCheck](https://github.com/P4ndro/SoundCheck)

---

## What it does

- **Songs** — repertoire library with workflow status, lyrics, and metadata
- **Tabs** — role-based instrument notation (ASCII tab and chord charts)
- **Setlists** — ordered song lists for gigs and rehearsals
- **Calendar** — rehearsals, gigs, and meetings
- **Chat** — band group chat with photo sharing
- **Band settings** — members, invite links, multi-band support

---

## Stack

React · TypeScript · Vite · Tailwind · TanStack Query · Express · Prisma · PostgreSQL (Neon) · Clerk · Cloudinary

Monorepo: `apps/web` (frontend) and `apps/api` (backend).

---

## Quick start

**Requirements:** Node.js 20+

**API** — copy `apps/api/.env.example` to `.env`, set database and Clerk keys, then:

```bash
cd apps/api
npm install
npm run db:migrate
npm run dev
```

Runs at [http://localhost:3001](http://localhost:3001).

**Web** — copy `apps/web/.env.example` to `.env.local`, set Clerk publishable key and `VITE_API_URL`, then:

```bash
cd apps/web
npm install
npm run dev
```

Runs at [http://localhost:5173](http://localhost:5173).

Sign up, complete onboarding, then create or join a band (`/join?code=...`).

---

## Project layout

```
SoundCheck/
├── apps/api/     Express API, Prisma, migrations
├── apps/web/     React app
└── docs/         Design, architecture, roadmap
```

Further detail: [Production roadmap](./docs/PRODUCTION.md) · [Testing](./docs/TESTING.md) · [API readme](./apps/api/README.md) · [Design](./docs/DESIGN.md)

---

## Contributors

- [P4ndro](https://github.com/P4ndro)

---

## License

MIT — see [LICENSE](./LICENSE).
