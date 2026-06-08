# Soundcheck — Architecture

**Current implementation:** React SPA in `apps/web`, in-memory state via `BandWorkspaceProvider`. No backend or auth yet.

## Principles

1. **UI-first** for university submission; backend phased in after screens are polished.
2. **Feature folders** — colocate routes, components, hooks, and types per domain.
3. **API boundary** — UI never calls `fetch` directly; use a service layer (later).
4. **Mock-first** — `mocks/` powers UI until real API is connected feature by feature.
5. **Security later** — no auth implementation until Clerk integration phase; no secrets in repo.

---

## Monorepo layout

```
soundcheck/
├── apps/
│   └── web/
│       ├── public/
│       └── src/
│           ├── app/              # Router, providers, route definitions
│           ├── components/
│           │   ├── ui/           # Primitives: Button, Input, Badge, Card...
│           │   └── layout/       # AppShell, SidebarNav, TopAppBar
│           ├── features/
│           │   ├── songs/        # Library, detail, kanban
│           │   ├── setlists/
│           │   ├── calendar/
│           │   ├── tabs/
│           │   ├── chat/         # Band group chat
│           │   ├── band/         # Settings, members, roles
│           │   └── auth/         # Clerk integration (Phase 3+)
│           ├── hooks/
│           ├── lib/              # cn(), formatters, constants
│           ├── services/         # API client (Phase 3+)
│           ├── types/
│           ├── mocks/
│           └── styles/           # tokens.css, globals
├── packages/
│   └── types/                    # Shared enums/DTOs (when API exists)
├── prisma/                       # Schema + migrations (Phase 3+)
└── docs/
```

---

## Planned component system

| Component      | Responsibility                    |
| -------------- | --------------------------------- |
| `SidebarNav`   | Primary module navigation         |
| `TopAppBar`    | Context header + actions          |
| `DataTable`    | Index views (songs, setlists)     |
| `StatusBadge`  | Song workflow states              |
| `CardContainer`| Mobile card layout                |
| `KanbanBoard`  | Status workflow view              |
| `CalendarGrid` | Event scheduling                  |
| `TabViewer`    | Instrument tab renderer           |
| `ModalDialog`  | Event detail, confirmations       |

---

## Data model (planned)

Core entities for Prisma schema (Phase 3):

- `User` — linked to Clerk
- `Band` — workspace
- `BandMember` — user + role (bass, drums, vocals, custom...)
- `Song` — title, BPM, lyrics, status, timestamps
- `InstrumentTab` — song + instrument + content
- `Setlist` — ordered songs
- `SetlistItem` — position + song reference
- `Event` — rehearsal/gig/meeting + optional setlist link
- `ChatMessage` — text or image message in band channel

---

## Shared modules (implemented)

| Module | Role |
|--------|------|
| `lib/create-id.ts` | ID generation for workspace mutations |
| `lib/workspace-mutation.ts` | Typed helper for provider state updates |
| `lib/song-form.ts` | Song form value mapping |
| `lib/song-utils.ts` | Song filtering and setlist resolution |
| `hooks/useActionSearchParam.ts` | Deep-link modal triggers (`?add=1`) |
| `components/shared/*` | Cross-feature UI (MetaItem, SearchInput, KanbanBoard…) |

---

## Security roadmap (not implemented yet)

- Clerk for authentication (MFA, passkeys)
- Server-side authorization checks per band membership
- Input validation (Zod) on API routes
- No `.env` files committed; use `.env.example` templates only
- CSRF protection when custom sessions exist (OWASP guidance)

---

## Responsive strategy

- **Submission target:** web (desktop-first layout, responsive down to mobile)
- **Mobile app:** Expo/React Native post-course, same API
