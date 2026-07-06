# Testing

SoundCheck uses **Vitest** for unit tests. Integration and E2E tests are planned in later phases.

## Commands

```bash
# API unit tests
cd apps/api
npm test
npm run test:watch

# Web unit tests
cd apps/web
npm test
npm run test:watch
```

## What is covered (Phase 1)

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

## CI

GitHub Actions runs on every push/PR to `main` and `production-readiness`:

- API: typecheck → test → build
- Web: lint → test → build

See [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## Next phases

- **Phase 2:** API integration tests (Supertest + test database)
- **Phase 3:** Playwright E2E on staging

See [PRODUCTION.md](./PRODUCTION.md) for the full roadmap.
