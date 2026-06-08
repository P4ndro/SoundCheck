# Soundcheck — Design System

Functional, workflow-first UI inspired by **Notion** (data), **Linear** (navigation/workflow), **Google Calendar** (scheduling), **Songsterr/Guitar Pro** (tabs), and **Bandhelper** (setlists/gigs).

**Not** a decorative or generic startup aesthetic. Clarity, speed, and readability for rehearsal and performance contexts.

---

## Color tokens

### Accent (muted violet — not neon)

| Token            | Role                                      |
| ---------------- | ----------------------------------------- |
| `accent`         | Primary CTA, active nav, links            |
| `accent-hover`   | Lighter violet tint on hover              |
| `accent-active`  | Darker pressed violet                     |
| `accent-muted`   | Lavender highlights, secondary emphasis   |

Suggested hex values (refine in `apps/web/src/styles/tokens.css`):

- `--color-accent`: `#6B5B95` (deep violet)
- `--color-accent-hover`: `#7D6FA8`
- `--color-accent-active`: `#564A7A`
- `--color-accent-muted`: `#9B8BB8` (lavender)

### Surfaces (dark theme)

| Token          | Role                          |
| -------------- | ----------------------------- |
| `background`   | Base canvas — dark charcoal   |
| `surface-1`    | Cards, panels                 |
| `surface-2`    | Modals, elevated containers   |

Suggested:

- `--color-background`: `#141418`
- `--color-surface-1`: `#1C1C22`
- `--color-surface-2`: `#25252D`

### Text

- `--color-text-primary`: high contrast (`#F4F4F5`)
- `--color-text-secondary`: metadata (`#A1A1AA`)
- `--color-text-muted`: timestamps, labels (`#71717A`)

### Semantic status

| State       | Color   | Use case              |
| ----------- | ------- | --------------------- |
| Neutral     | Gray    | Not started           |
| Warning     | Amber   | In progress           |
| Info        | Violet  | Ready / review        |
| Success     | Green   | Completed             |

---

## Typography

Hierarchy via **weight**, **opacity**, and **size** — not decorative fonts.

| Level        | Use                          |
| ------------ | ---------------------------- |
| Primary      | Titles, body content         |
| Secondary    | Metadata, column headers     |
| Muted        | Timestamps, helper text      |
| Monospace    | BPM, tab notation, code-like content |

Font pairing (to implement):

- UI: **Inter** or **Geist** — clean, professional, not overused in AI slop if paired with strong layout
- Tabs/code: **JetBrains Mono** or **IBM Plex Mono**

---

## Layout architecture

### Application shell (three-tier)

1. **Sidebar** — primary navigation (persistent)
2. **Top app bar** — contextual controls (sticky)
3. **Main canvas** — dynamic view container

### Primary navigation (sidebar)

| Item           | Route (planned)   |
| -------------- | ----------------- |
| Songs          | `/songs`          |
| Setlists       | `/setlists`       |
| Calendar       | `/calendar`       |
| Tabs           | `/tabs`           |
| Band Settings  | `/settings`       |

Pattern: **Linear-style** — icon + label, active left border or fill, collapsible icon-only mode.

### Top app bar

- Page title / band context
- Global search (command palette optional, later)
- Band switcher (multi-band, later)
- User profile menu

Behavior: sticky, context-aware actions per route.

---

## Content layout patterns

| Pattern        | Used for                    | Reference        |
| -------------- | --------------------------- | ---------------- |
| Data table     | Songs, setlists, members    | Notion / Linear  |
| Detail view    | Song, setlist, event        | Document workspace |
| Kanban board   | Song status workflow        | Trello / Linear  |
| Calendar grid  | Rehearsals, gigs, events    | Google Calendar  |
| Tabs interface | Instrument-focused view     | Songsterr hybrid |

### Song library

- **Desktop:** data table (Notion database)
- **Mobile:** card list

### Setlists

- Start: numbered list + up/down reorder
- Later: drag-and-drop

### Tabs

- Toggle: ASCII tab **or** chord chart + lyrics per song
- Left: song list | Main: tab renderer | Top: instrument filter
- Role-filtered by default; permission-based edit

---

## Interaction states

- **Hover:** surface elevation or subtle opacity
- **Active:** accent highlight
- **Focus:** visible ring (accessibility)
- **Selected:** persistent highlight

Minimal animation — functional transitions only.

---

## UX constraints

- Information density over decoration
- Max 2–3 steps per common task
- Context-aware UI per route
- Consistent component reuse
- Keyboard navigation as optional enhancement
- Every list: loading, empty, and error states
