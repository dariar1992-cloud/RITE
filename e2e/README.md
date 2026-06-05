# RITE end-to-end tests

Playwright suite covering the web app's full user flows. Voice playback is
mocked at the route layer by default so tests are fast and don't burn ElevenLabs
credits.

## One-time setup

```bash
npm install
npm run test:e2e:install   # downloads the Chromium binary Playwright uses
```

## Run

```bash
# All tests (boots Expo web dev server automatically)
npm run test:e2e

# Headed mode with the time-travel UI
npm run test:e2e:ui

# View the last HTML report
npx playwright show-report

# Real voice smoke test (hits ElevenLabs — requires ELEVENLABS_API_KEY in .env.local)
npm run test:e2e:voice
```

If you already have `npm run web` running on `localhost:8081`, the suite reuses it.
You can also point at another origin:

```bash
RITE_BASE_URL=http://localhost:3000 npm run test:e2e
```

## What's covered

`onboarding.spec.ts`
- First launch redirects to onboarding.
- All three guides (Sage / Arjun / Akasha) and archetypes render.
- "Enter RITE" gated until a guide is selected.
- Preview button triggers a POST to `/api/voice` with `{ text, voiceId }`.
- Selecting a guide routes to cycle opt-in.
- Cycle opt-in skip lands on home.
- Returning user is not re-onboarded after reload.

`session.spec.ts`
- Home renders the readiness ring + history footer.
- **Stolen Moment** full flow: home → check-in (state, duration, optional charge)
  → 4 layers (Body / Energy / Mind / Soul) → complete screen.
- **Wind Down** flow records the session: streak `1`, history `1`.
- `/api/voice` fires at least once during the session.

`navigation.spec.ts`
- Settings, Methodology, Evidence library are reachable.
- "Sync across devices · Coming soon" is present.

`voice-real.spec.ts` (skipped unless `RITE_REAL_VOICE=1`)
- Hits the real ElevenLabs route and asserts an `audio/mpeg` body comes back.

## Notes

- Each test resets `localStorage` (the zustand persistence key is `rite-store`)
  so onboarding state doesn't bleed between tests.
- The dev server is the production-equivalent host for API routes — `app.json`
  is `"output": "server"`, so the dev server already mirrors what production
  would do. A pure static export strips `/api/voice`; don't run tests against
  `npx serve dist`.
