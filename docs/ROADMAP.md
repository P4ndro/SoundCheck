# Soundcheck — Development Roadmap

Work incrementally. Each phase ends with something demoable.

---

## Phase 0 — Scaffold ✅

- [x] Repo structure and documentation
- [x] Tooling config (Vite, TypeScript, Tailwind, ESLint)
- [x] Verified: `cd apps/web && npm install && npm run dev`

---

## Phase 1 — Design tokens + app shell ✅

**Goal:** Empty shell that looks like a real product, not a blank page.

- [x] CSS tokens and global styles (`styles/globals.css`)
- [x] UI primitives — Button, Input, Badge, ModalDialog, FormField…
- [x] `SidebarNav`, `TopAppBar`, `AppShell`
- [x] React Router with all primary routes

---

## Phase 2 — High-fidelity screens (mock data) ✅

**Goal:** All core views navigable and polished for grading.

- [x] Type definitions (`Song`, `Setlist`, `Event`, `ChatMessage`, etc.)
- [x] Mock data (demo band, songs, setlists, events, tabs, chat)
- [x] Songs — table/cards, status filters, kanban, detail view
- [x] Setlists — list, detail, song reorder
- [x] Calendar — month grid, schedule modal, setlist link
- [x] Tabs — song sidebar, instrument filter, ASCII tab viewer
- [x] Band settings — members, roles, invite modal
- [x] Band chat — group messages with text and photos
- [x] Empty states, toasts, modal flows
- [x] Code quality pass — shared utils, deduplicated components

---

## Phase 3 — Backend + auth

| # | Task |
|---|------|
| 3.1 | Prisma schema + PostgreSQL |
| 3.2 | Express API with Zod validation |
| 3.3 | Clerk integration |
| 3.4 | Connect songs feature end-to-end |
| 3.5 | Remaining features one at a time |

---

## Phase 4 — Polish + presentation

| # | Task |
|---|------|
| 4.1 | Setlist drag-and-drop improvements |
| 4.2 | Command palette search (optional) |
| 4.3 | Setlist experiment + voting (innovation) |
| 4.4 | Tab/chord notation editor |
| 4.5 | Demo script + user journeys |
| 4.6 | Accessibility pass (focus rings, labels) |

---

## Grading alignment

| Criterion | How we address it |
|-----------|-------------------|
| UI/UX (14) | Dark theme, tokens, shell, all hero screens |
| Functionality (10) | Full mock flows; Phase 3 for persistent data |
| Code quality (6) | Feature folders, shared lib, typed context |
| Innovation (4) | Kanban, role-based tabs, band chat |
| Usability (4) | States, feedback, short task flows |
| Presentation (2) | Phase 4 demo script |
