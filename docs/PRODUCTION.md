# SoundCheck — Production Roadmap

Track progress from MVP to a secure, fast, reliable production product.

**North star:** Every visible action works end-to-end. Deploys are automated. Failures are observable. Abuse is rate-limited.

---

## How to use this doc

- Check boxes as work ships (`[x]`).
- Work **streams A–E** run in parallel after Phase 0.
- **PR order** at the bottom is the suggested solo-dev sequence.

---

## Phase 0 — Stabilize baseline

- [ ] Commit and tag current MVP (`v0.9-mvp`)
- [ ] Branch strategy: `main` (stable), `develop` (integration), feature branches
- [ ] Production inventory: every UI action → API route → file (audit table)
- [x] Gate mock workspace fallback to dev only (`emptyWorkspace` in prod)
- [ ] `apps/web` and `apps/api` production builds pass locally
- [ ] `prisma migrate deploy` succeeds on clean database
- [ ] Never auto-seed production database

---

## Stream A — Product completeness

### A1 — Calendar full CRUD
- [x] Edit event UI (`ScheduleEventModal` edit mode)
- [x] Delete event UI (`ConfirmDeleteModal`)
- [x] `updateEvent` / `deleteEvent` in `BandWorkspaceProvider`
- [ ] Link setlist from event detail (exists — verify in prod)

### A2 — Band settings persist
- [x] `PATCH /api/bands/:bandId` (name)
- [x] `updateBandRequest` + provider wiring
- [x] Settings save with success/error toast

### A3 — Workspace / tabs consistency
- [ ] Remove `tabs` from `loadWorkspacePayload`
- [ ] Tabs pages use `useSongTabsQuery` / `useBandTabs` only
- [ ] Invalidate tab queries after create/update on `TabEditPage`

### A4 — Song detail delete
- [ ] Delete button on `SongDetailPage` + confirm modal

### A5 — Error UX
- [ ] React `ErrorBoundary` at app shell
- [ ] Consistent API error toasts (no silent `reloadWorkspace`)
- [ ] Loading states — no flash of mock data in prod

### A6 — Calendar polish
- [ ] Empty month states
- [ ] Event detail → setlist navigation verified

**Stream A exit:** All primary modules work API → UI → API with clear errors.

---

## Stream B — Architecture, speed & reliability

### B1 — Slim workspace payload
- [ ] Split monolithic workspace into per-domain queries
- [ ] Core: band + members only on initial load
- [ ] Songs, setlists, events via existing list endpoints
- [ ] Target: initial band load < 200ms API (50 songs)

### B2 — Pagination
- [ ] Chat cursor pagination + load older on scroll
- [ ] Songs search/cursor when library > 100

### B3 — Real-time chat
- [ ] SSE stream endpoint for new messages
- [ ] Server-side read receipts (`ChatReadState` table)
- [ ] Unread badge from API (not `localStorage` only)

### B4 — Conflict handling
- [ ] `updatedAt` checks on PATCH → 409 Conflict
- [ ] UI prompt on stale edit
- [ ] Unsaved changes warning on tab editor navigation

### B5 — Frontend performance
- [ ] Route-level `React.lazy` + `Suspense`
- [ ] Per-resource `staleTime` tuning
- [ ] Chat image thumbnails via Cloudinary transforms

### B6 — API performance
- [ ] Index audit on Prisma schema
- [ ] Response compression (gzip)
- [ ] Optional Redis for rate limits / chat pub-sub at scale

**Stream B exit:** Band switch feels instant; chat does not hammer API; workspace < 50KB typical.

---

## Stream C — Security & governance

### C1 — Band roles
- [ ] Owner / Admin / Member permission model
- [ ] `requireBandAdmin` / `requireBandOwner` middleware
- [ ] Protect invite regenerate, member remove, band delete, rename (admin+)

### C2 — Member lifecycle
- [ ] Leave band endpoint + UI
- [ ] Remove member (admin) endpoint + UI
- [ ] Transfer ownership

### C3 — API hardening
- [ ] Global rate limiting (reads + writes + uploads)
- [ ] Request ID middleware (`X-Request-Id`)
- [ ] Structured logging (pino)
- [ ] CSP headers tuned for Clerk + Cloudinary
- [ ] CORS locked to prod origin only
- [ ] IDOR audit on all `:bandId` child resources

### C4 — Auth & accounts
- [ ] Clerk production instance + optional MFA
- [ ] In-app delete account flow
- [ ] Webhook user delete → soft delete verified in prod

### C5 — Upload security
- [ ] Magic-byte file type validation on chat upload
- [ ] Max image dimensions server-side
- [ ] Cloudinary URL validation (partial — verify complete)

### C6 — Invite security
- [ ] Atomic `useCount` increment on join
- [ ] Expiry / max uses enforced on join path
- [ ] Admin-only invite regenerate

### C7 — Supply chain
- [ ] Dependabot / Renovate
- [ ] `npm audit` in CI (fail on high/critical)
- [ ] Secrets rotation runbook

### C8 — Legal
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Data export endpoint (GDPR basics)
- [ ] Delete account + data removal documented

**Stream C exit:** Role matrix documented; rate limits on writes; security checklist signed off.

---

## Stream D — Quality, testing & operations

### D1 — Tests
- [x] Vitest setup (api + web unit)
- [x] Unit tests: permissions, invites, validation, key utils
- [x] API integration tests (supertest + test DB)
- [ ] Playwright E2E — sign up + onboarding
- [ ] E2E — invite join second user
- [ ] E2E — song CRUD + delete
- [ ] E2E — setlist create/reorder/delete
- [ ] E2E — chat message + image upload
- [ ] E2E — tab create/edit (role-locked)

### D2 — CI/CD
- [x] GitHub Actions: lint, typecheck, test, build on PR
- [ ] Deploy staging on merge to `develop`
- [ ] Deploy production on tagged release
- [ ] `prisma migrate deploy` in deploy pipeline (never `migrate dev` in prod)

### D3 — Environments
- [ ] Local (Neon dev branch + Clerk test)
- [ ] Staging (Neon staging + staging URLs)
- [ ] Production (Neon prod project + Clerk live)

### D4 — Monitoring
- [ ] Sentry on API + web (source maps)
- [ ] Uptime monitor on `/api/health`
- [ ] Log aggregation (host drain or Axiom/Datadog)
- [ ] Alerts: 5xx spike, health down, DB errors

### D5 — Runbooks (`docs/runbooks/`)
- [ ] Deploy and rollback
- [ ] Database restore (Neon PITR)
- [ ] Clerk webhook misconfiguration
- [ ] Cloudinary outage (degraded chat images)
- [ ] Incident response

### D6 — Database ops
- [ ] Neon PITR enabled on prod
- [ ] Backup restore test (quarterly)
- [ ] Backward-compatible migration policy

**Stream D exit:** CI green on every PR; staging E2E pass; Sentry live; runbooks written.

---

## Stream E — Production launch

### E1 — Hosting
- [ ] Web: Vercel / Cloudflare Pages
- [ ] API: Railway / Render
- [ ] DB: Neon production project
- [ ] Auth: Clerk live
- [ ] Media: Cloudinary production

### E2 — Environment variables

**API (production)**
- [ ] `NODE_ENV=production`
- [ ] `DATABASE_URL` (Neon pooled, `sslmode=require`)
- [ ] `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY` (live)
- [ ] `CLERK_WEBHOOK_SECRET`
- [ ] `CORS_ORIGIN` = exact frontend URL
- [ ] `CLOUDINARY_*`

**Web (production)**
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` (live)
- [ ] `VITE_API_URL` = production API URL

### E3 — Clerk production
- [ ] Live application created
- [ ] Allowed origins: prod + staging only
- [ ] Webhook → `https://api.<domain>/api/webhooks/clerk`

### E4 — DNS & TLS
- [ ] `app.<domain>` → web host
- [ ] `api.<domain>` → API host
- [ ] HTTPS verified

### E5 — Pre-launch checklist
- [ ] Stream A complete (or P0 items)
- [ ] Two-account smoke test on staging
- [ ] Invite flow with production URL
- [ ] Chat upload on prod Cloudinary
- [ ] Rate limits enabled
- [ ] No test keys in prod
- [ ] Privacy + Terms linked in app

### E6 — Launch day
- [ ] `prisma migrate deploy` on prod
- [ ] Deploy API → deploy web
- [ ] Playwright smoke against prod (read-only)
- [ ] Monitor Sentry 24h

### E7 — Post-launch (first 2 weeks)
- [ ] Fix top 3 Sentry errors
- [ ] Measure p95 latency per route
- [ ] User feedback channel
- [ ] LCP < 2.5s on dashboard

---

## Production inventory (audit)

| UI action | API | Status |
|-----------|-----|--------|
| Add/edit/delete song | `POST/PATCH/DELETE .../songs` | Done |
| Add/edit/delete setlist | `POST/PATCH/DELETE .../setlists` | Done |
| Schedule event | `POST .../events` | Done |
| Edit/delete event | `PATCH/DELETE .../events/:id` | Done (UI) |
| Save band name | `PATCH .../bands/:bandId` | Done |
| Add/edit notation | `POST/PATCH .../songs/:id/tabs` | Done |
| Chat message / upload | `POST .../chat/messages`, `.../uploads` | Done |
| Invite / join band | `GET/POST .../invite`, join onboarding | Done |
| Remove member | — | Missing |
| Leave band | — | Missing |
| Delete band | — | Missing |

---

## Suggested PR order

| Week | PR | Focus |
|------|-----|--------|
| 1 | PR1 | Phase 0 — builds, mock gate, tag |
| 1 | PR2 | Band rename API + UI |
| 1 | PR3 | Calendar edit/delete UI |
| 1 | PR4 | Remove tabs from workspace payload |
| 2 | PR5 | GitHub Actions CI |
| 2 | PR6 | Vitest + API integration tests |
| 2 | PR7 | ErrorBoundary + error toasts |
| 2 | PR8 | Rate limiting + logging |
| 3 | PR9 | Split workspace queries (frontend) |
| 3 | PR10 | Band owner/admin roles |
| 3 | PR11 | Leave / remove member |
| 3 | PR12 | Playwright E2E |
| 4 | PR13–16 | Staging, monitoring, legal, prod deploy |

---

## Definition of done — production product

- [ ] Hosted on production URLs with Clerk live
- [ ] Zero UI actions without API backing
- [ ] CI + E2E green on staging
- [ ] Sentry + uptime monitoring active
- [ ] Rate limits on write endpoints
- [ ] Band admin model + member management
- [ ] Optimized workspace load
- [ ] Privacy Policy + Terms published
- [ ] Deploy, rollback, and DB restore runbooks
- [ ] Real band can onboard without manual DB edits

---

## Related docs

- [Architecture](./ARCHITECTURE.md)
- [Roadmap](./ROADMAP.md) — university delivery phases
- [API readme](../apps/api/README.md)
