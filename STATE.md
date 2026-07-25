# STATE.md — Landing Page

> Last updated: 2026-07-18. Based on static code scan of this repository.

---

## 1. Overview

The `Landing-Page` is TapTile's public-facing marketing website, built with Vite + React + TypeScript. It is a single-page application (SPA) with no backend or API dependency — all content is static and hard-coded. Its role in the Taptile ecosystem is purely presentational: it introduces the TapTile product to prospective merchants, explains the value proposition (digital receipts, FBR compliance, environmental impact), and provides a "Get in Touch" / "Book a Demo" contact form. The design language is neobrutalist — thick black borders, hard box shadows, uppercase typography — and uses a chameleon mascot (`chameleon_*.png`) as a brand element in an animated interactive trail effect.

---

## 2. Current Status

**Visually complete, functionally a prototype — the contact/demo form is non-functional.**

Evidence:
- All major page sections are implemented and rendered (hero, platform overview, integration, security, pricing, contact/footer).
- The `TrailCanvas.tsx` component (chameleon image trail following the cursor) is a fully built interactive feature.
- The "Book a Demo," "Request Integration," and contact form `<button type="submit">` all call `e.preventDefault()` with no submission handler wired in — these are UI shells.
- Several one-off JS scripts (`fix.js`, `replace.js`, `padding.js`, etc.) remain at the root, left over from development iterations. These are not part of the app.
- `node_modules` is not present — the project has not been installed locally since cloning.
- Dependencies include `@google/genai` and `express` in `dependencies` (not `devDependencies`), which is unusual for a static landing page — suggests a serverless function or AI feature may have been planned but is not visible in the current source.

---

## 3. What's Implemented

- **Full landing page layout** — hero section, platform features, integration flow, security section, pricing section, "Get in Touch" footer section
- **Animated chameleon trail** (`TrailCanvas.tsx`) — interactive cursor-following image trail using `motion` from Framer Motion
- **Responsive design** — layout uses Tailwind v4 (via `@tailwindcss/vite`) with mobile-first breakpoints
- **Neobrutalist design system** — consistent border/shadow/hover style applied across all CTAs and cards
- **Static content data** (`src/data.ts`) — trail images exported as a typed array; `src/types.ts` defines `ActiveTrailImage` interface
- **Build pipeline** — Vite configured with `@vitejs/plugin-react`, `@/` path alias, and HMR toggle via `DISABLE_HMR` env var

---

## 4. What's Incomplete or Mocked

- **"Book a Demo" button** (`App.tsx`) — renders correctly but has no `onClick` handler and no routing target. Dead UI.
- **"Request Integration" button** — same; no handler.
- **Contact form** (`App.tsx`) — collects Business Name, Contact Email, City, Daily Transactions. The `onSubmit` calls `e.preventDefault()` and stops there. No API call, no email service, no state management.
- **`@google/genai` dependency** — listed in `package.json` dependencies but not imported anywhere in visible source (`App.tsx`, `data.ts`, `types.ts`, `TrailCanvas.tsx`, `main.tsx`). Likely a planned AI feature (e.g. automated demo scheduling or chat) that was never implemented.
- **`express` dependency** — similarly in `dependencies` with no visible usage in the SPA source. May relate to the now-deleted `server.js` (referenced in the `clean` script: `rm -rf dist server.js`), suggesting a previously scaffolded SSR or serverless setup was abandoned.

---

## 5. Known Issues / Tech Debt

- **8 one-off development scripts at repo root** — `fix.js`, `fix_buttons.js`, `fix_padding.js`, `padding.js`, `replace.js`, `replace2.js`, `update.js`, `update-backgrounds.js`, `dump-all.ts` are clearly iterative patch scripts from during development. They are **not part of the app**, are not imported anywhere, and are safe to delete. They are already excluded from `.graphifyignore`.
- **`express` and `@google/genai` in `dependencies` (not `devDependencies`)** — increases bundle size and misleads static analysis. Should either be moved to `devDependencies` or removed if the features they support were abandoned.
- **`clean` script references `server.js`** — `"clean": "rm -rf dist server.js"`. The `server.js` it refers to no longer exists in source, indicating this script is a stale leftover from a previous architecture. Harmless but confusing.
- **No `.env.example`** — the `DISABLE_HMR` env var is consumed by `vite.config.ts` but is not documented anywhere.
- **`node_modules` not installed** — running `npm install` is required before any development can begin.

---

## 6. Dependencies on Other Taptile Projects

**None.** The landing page is entirely self-contained — it makes no API calls, has no auth layer, and references no other Taptile service. It is the only project in the monorepo with zero runtime dependency on any other project.

See `ARCHITECTURE.md` for the full cross-project dependency map.

---

## 7. Required Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DISABLE_HMR` | ⚠️ Optional | Set to `"true"` to disable Vite HMR and file watching (used in AI-assisted editing environments) |

**`.env.example` exists:** ❌ No.

---

## 8. How to Run Locally

```bash
# 1. Install dependencies (not yet installed — node_modules absent)
npm install

# 2. Start dev server on port 3000
npm run dev
# → Available at http://localhost:3000

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview

# 5. Type-check without emitting
npm run lint   # (runs tsc --noEmit)
```
