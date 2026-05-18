# RITE

**Strategic recovery for those who never stop.**

Guided recovery protocol app for founders, executives, and professional athletes. Two modes (Stolen Moment · Wind Down), each a 4-step session (Body → Energy → Mind → Soul) read aloud by an ElevenLabs voice guide.

Built with Expo Router (iOS, Android, Web from a single codebase), NativeWind v4, Zustand, Reanimated.

## Quick start

```bash
npm install
cp .env.local.example .env.local   # then fill in your ELEVENLABS_API_KEY
npm run web      # http://localhost:8081
npm run ios
npm run android
```

The ElevenLabs API key is read server-side by `app/api/voice+api.ts`. Never expose it via `EXPO_PUBLIC_*` or hardcode it in client code.

For native production builds, set `EXPO_PUBLIC_API_BASE_URL` to the deployed origin that hosts the `/api/voice` route.

## What works in this scaffold

End-to-end working slice: Onboarding (pick voice guide + preview) → Home → Check-in → Session (Stolen Moment, 2 min) → Complete, with the `/api/voice` proxy calling ElevenLabs for real audio. Wind Down screens are reachable but not yet polished. See `/Users/dariaravnopolets/.claude/plans/scaffold-the-expo-project-sharded-karp.md` for the implementation plan and deferred work.

## Layout

```
app/
  _layout.tsx           root layout, font loading, splash, redirect
  index.tsx             Home
  onboarding.tsx        Voice guide selection
  checkin.tsx           State + duration picker
  session.tsx           4-step guided session
  complete.tsx          Streak + metrics + return CTA
  api/voice+api.ts      ElevenLabs server-side proxy
components/             BreathingRing, Waveform, GoldButton, AmbientOrb, Brand
constants/design.ts     COLORS, TYPOGRAPHY, SPACING, ANIMATION, GUIDES
data/sessions.ts        All 8 session steps (PRD §9.5)
hooks/useVoice.ts       Cross-platform audio (web blob URL / native expo-audio)
store/useRiteStore.ts   Zustand + persist (AsyncStorage native, localStorage web)
```

## Design constraints (locked)

Palette, typography, breathing ring 8s ease-in-out, opacity-only screen transitions, and the 4-layer framework are all fixed per the PRD. Do not modify without product approval.
