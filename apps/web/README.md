# Soundcheck Web

React frontend for the Soundcheck band workspace.

## Setup

```bash
npm install
npm run dev
```

## Source layout

| Path | Purpose |
|------|---------|
| `src/app/` | Router, providers, route config |
| `src/components/ui/` | Primitives — Button, Input, ModalDialog, Badge… |
| `src/components/layout/` | AppShell, SidebarNav, TopAppBar |
| `src/components/shared/` | Cross-feature components — KanbanBoard, FilterBar… |
| `src/features/*/` | Feature modules — pages, feature components, local utils |
| `src/hooks/` | Shared hooks (`useBandWorkspace`, `useActionSearchParam`) |
| `src/lib/` | Pure utilities — formatters, song helpers, navigation |
| `src/mocks/` | In-memory demo data |
| `src/providers/` | `BandWorkspaceProvider`, `ToastProvider` |
| `src/styles/` | `globals.css`, design tokens |
| `src/types/` | Shared TypeScript types |

## Path alias

`@/` resolves to `src/` — configured in `vite.config.ts` and `tsconfig.app.json`.

## Data layer

State lives in `BandWorkspaceProvider`. Components read via `useBandWorkspace()` and mutate through provider methods (`addSong`, `createSetlist`, `addEvent`, `sendChatMessage`, etc.). Replace the provider internals with API calls when the backend is ready — the context interface stays the same.

## Routes

| Path | Page |
|------|------|
| `/songs` | Song library + kanban |
| `/songs/:id` | Song detail |
| `/setlists` | Setlist index |
| `/setlists/:id` | Setlist detail |
| `/calendar` | Band calendar |
| `/tabs` | Instrument notation viewer |
| `/chat` | Band group chat |
| `/settings` | Band settings |
