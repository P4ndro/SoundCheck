# Testing

SoundCheck uses **Vitest** for unit and integration tests. E2E (Playwright) is Phase 3.

## Commands

```bash
# API unit tests (no database required)
cd apps/api
npm test
npm run test:watch

# API integration tests (requires Postgres + migrations)
cd apps/api
npx prisma migrate deploy
npm run test:integration

# Web unit tests
cd apps/web
npm test
npm run test:watch
```

## Phase 1 — Unit tests

### API (`apps/api`)

| Area | File |
|------|------|
| Tab permissions | `src/lib/tab-permissions.test.ts` |
| Invite logic | `src/lib/invite-service.test.ts` |
| Tab validation | `src/schemas/tab.test.ts` |
| Song validation | `src/schemas/song.test.ts` |
| Event validation | `src/schemas/event.test.ts` |

### Web (`apps/web`)

| Area | File |
|------|------|
| Song helpers | `src/lib/song-utils.test.ts` |
| Chat clustering | `src/features/chat/lib/chat-utils.test.ts` |
| Invite codes | `src/lib/invite-code.test.ts` |

## Phase 2 — API integration tests

Uses **Supertest** against a real Postgres database. Auth is bypassed in Vitest only via the `x-test-user-id` header (`createApp({ skipClerk: true })`).

| Area | File |
|------|------|
| Health | `src/health.integration.test.ts` |
| Auth (401/403) | `src/health.integration.test.ts` |
| Songs CRUD | `src/songs.integration.test.ts` |
| Tabs create/409/update | `src/tabs.integration.test.ts` |

Helpers: `src/test/integration-helpers.ts`

Integration tests **skip automatically** when the database is unreachable (local dev without Postgres). CI runs them against a Postgres service container.

### Local Postgres for integration tests

```bash
# Example with Docker
docker run --name soundcheck-test-db -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test -e POSTGRES_DB=soundcheck_test -p 5432:5432 -d postgres:16

cd apps/api
set DATABASE_URL=postgresql://test:test@localhost:5432/soundcheck_test
npx prisma migrate deploy
npm run test:integration
```

## CI

GitHub Actions on `main` and `production-readiness`:

- **API:** typecheck → unit tests → migrate → integration tests → build
- **Web:** lint → unit tests → build

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Next

- **Phase 3:** Playwright E2E on staging

See [PRODUCTION.md](./PRODUCTION.md) for the full roadmap.
