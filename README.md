# Soundcheck

A collaborative workspace for bands — manage songs, setlists, rehearsals, instrument notation, and internal chat in one place.

Built as a university final project with a UI-first approach: the web app is fully navigable today on mock data, with a clear path to backend integration later.

**Repository:** [github.com/P4ndro/SoundCheck](https://github.com/P4ndro/SoundCheck)

---

## Features

| Module | What it does |
|--------|----------------|
| **Songs** | Library with status filters, kanban workflow, and song detail (lyrics, BPM, key, notes) |
| **Tabs** | Role-based instrument view with ASCII tab/chord display and per-song part switching |
| **Setlists** | Create setlists, reorder songs, link to calendar events |
| **Calendar** | Month view for rehearsals, gigs, and meetings |
| **Chat** | Band group chat with text and photo messages |
| **Settings** | Member roster, roles, and band configuration |

All data is held in-memory via `BandWorkspaceProvider` — no API or authentication yet.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, React Router 7 |
| Styling | Tailwind CSS v4, custom design tokens |
| Build | Vite 6 |
| Drag & drop | `@dnd-kit` (kanban, setlist reorder) |
| Planned backend | Node.js, Express, PostgreSQL, Prisma, Clerk |

---

## Getting started

**Requirements:** Node.js 20+

```bash
cd apps/web
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The app loads demo data for band *The Marlowe*.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type-check and production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

---

## Project structure

```
SoundCheck/
├── apps/
│   └── web/                  # React frontend
│       └── src/
│           ├── app/          # Router and root layout
│           ├── components/   # Shared UI and layout primitives
│           ├── features/     # Domain modules (songs, setlists, calendar, tabs, chat, band)
│           ├── hooks/        # Reusable React hooks
│           ├── lib/          # Utilities, formatters, constants
│           ├── mocks/        # Demo workspace data
│           ├── providers/    # React context providers
│           ├── styles/       # Global CSS and design tokens
│           └── types/        # TypeScript interfaces
└── docs/                     # Design system, architecture, roadmap
```

Path alias `@/` maps to `apps/web/src/`.

---

## Documentation

- [Design system](./docs/DESIGN.md) — tokens, typography, component patterns
- [Architecture](./docs/ARCHITECTURE.md) — folder conventions, data model, security plan
- [Roadmap](./docs/ROADMAP.md) — phased delivery and grading alignment

---

## Current status

- **Done:** App shell, all core screens, mock CRUD, chat, code-quality refactor
- **Next:** Backend API, Prisma schema, Clerk auth (Phase 3)
- **Later:** Mobile app (Expo), notation editor, setlist voting

---

## License

MIT — see [LICENSE](./LICENSE).
